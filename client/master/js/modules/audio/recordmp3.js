/***********************
 * IMPORTANT:  This script relies on the libmp3lame.min.js file
 * to be accessible from {domain}/vendor/libmp3lame.min.js, and
 * this vendor file is NOT managed by bower
 */
(function(window){
  'use strict';

  var RecorderWorker = function (me, params) {

    if (typeof Lame === 'undefined') {
      importScripts(params.lameUrl);
    }

    var recLength = 0,
      recBuffer = [],
      mp3codec,
      sampleRate;

    this.onmessage = function(e) {
      switch (e.data.command) {
        case 'init':
          init(e.data.sampleRate);
          break;
        case 'record':
          record(e.data.buffer);
          break;
        case 'exportMP3':
          exportMP3();
          break;
        case 'clear':
          clear();
          break;
      }
    };

    function init(rate) {
      sampleRate = rate;
      mp3codec = Lame.init();

      Lame.set_mode(mp3codec, Lame.MONO);
      Lame.set_num_channels(mp3codec, 1);
      Lame.set_num_samples(mp3codec, -1);
      Lame.set_in_samplerate(mp3codec, sampleRate);
      Lame.set_out_samplerate(mp3codec, sampleRate);
      Lame.set_bitrate(mp3codec, 16);

      Lame.init_params(mp3codec);
    }

    function record(inputBuffer) {
      recBuffer.push(inputBuffer);
      recLength += inputBuffer.length;
    }

    function clear() {
      Lame.encode_flush(mp3codec);
      Lame.close(mp3codec);
      mp3codec = null;
      recLength = 0;
      recBuffer = [];
      init(sampleRate);
    }

    function exportMP3() {
      var buffer = mergeBuffers();
      var mp3data = Lame.encode_buffer_ieee_float(mp3codec, buffer, buffer);
      var mp3Blob = new Blob(
        [ new Uint8Array(mp3data.data) ],
        { type: 'audio/mp3' }
      );
      this.postMessage(mp3Blob);
    }

    function mergeBuffers() {
      var result = new Float32Array(recLength),
        offset = 0, i = 0, len = recBuffer.length;
      for (; i < len; i++) {
        result.set(recBuffer[i], offset);
        offset += recBuffer[i].length;
      }
      return result;
    }
  };

  var SCRIPT_BASE = (function () {
    var scripts = document.getElementsByTagName('script');
    var myUrl = scripts[scripts.length - 1].getAttribute('src');
    var path = myUrl.substr(0, myUrl.lastIndexOf('/') + 1);
    if (path && !path.match(/:\/\//)) {
      var a = document.createElement('a');
      a.href = path;
       return a.href;
    }
    return path;
  }());

  var Recorder = function(stream, context){
    var audioInput, processor, gain, gainFunction, processorFunction;
    var recording = false, currCallback;

    gainFunction = context.createGain || context.createGainNode;
    gain = gainFunction.call(context);
    audioInput = context.createMediaStreamSource(stream);
    console.log('Media stream created.' );
    console.log("input sample rate " +context.sampleRate);

    audioInput.connect(gain);
    console.log('Input connected to audio context destination.');

    processorFunction = context.createScriptProcessor || context.createJavaScriptNode;
    processor = processorFunction.call(context, 4096, 2, 2);

    var config = {
      lameUrl: (SCRIPT_BASE + '/../../../vendor/recordmp3/js/libmp3lame.min.js')
    }
    var worker = RecorderWorker.toWorker(config);
    worker.postMessage({
      command: 'init',
      sampleRate: context.sampleRate
    });

    processor.onaudioprocess = function(e){
      if (!recording) return;
      worker.postMessage({
        command: 'record',
        buffer: e.inputBuffer.getChannelData(0)
      });
    }

    this.record = function(){
      recording = true;
    }

    this.stop = function(){
      recording = false;
    }

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    }

    this.exportMP3 = function(cb){
      currCallback = cb;
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({ command: 'exportMP3' });
    }

    worker.onmessage = function(e){
      var blob = e.data;
      currCallback(blob);
    }

    gain.connect(processor);
    processor.connect(context.destination);
  };

  window.Recorder = Recorder;

})(window);

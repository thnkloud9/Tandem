'use strict';

/* audio recorder service. */
angular.module('app.audio').service('recorder', [ 
  '$q',
  function recorder($q) {
    var self = this;

    self.recorder = false;
    self.recordingUrl = null;
    self.blob = null;
    self.recording = false;
    self.processing = false;

    // only set this once for session
    self.audioContext = new AudioContext;

    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = ( navigator.getUserMedia ||
                     navigator.webkitGetUserMedia ||
                     navigator.mozGetUserMedia ||
                     navigator.msGetUserMedia);
      window.URL = window.URL || window.webkitURL;

      console.log('Audio context set up.');
      console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
      alert('No web audio support in this browser!');
    }

    self.initRecorder = function () {
      var deferedInit = $q.defer();
      var recorder;

      navigator.getUserMedia({audio: true},
        // success callback 
        function startUserMedia(stream) {
          recorder = new Recorder(stream, self.audioContext);
          self.recorder = recorder;
          deferedInit.resolve(recorder);
          console.log('Recorder initialised.');
        },
        // error callback
        function (e) {
          console.log('No live audio input: ' + e);
          // TODO: test if we should reject the deferedInit here
        }
      );

      return deferedInit.promise;
    };

    self.record = function () {
      self.initRecorder().then(function (recorder) {
        self.recorder = recorder;
        self.recorder.record();
        self.recording = true;
        console.log('Started recording');
      });
    };

    self.stop = function () {
      self.recorder.stop();
      self.processing = true;
      return self.exportMP3();
    };

    self.exportMP3 = function () {
      var deferedUrl = $q.defer();
      self.recorder.exportMP3(function (blob) {
        URL.revokeObjectURL(self.recordingUrl);
        self.recordingUrl = URL.createObjectURL(blob);
        self.blob = blob;
        self.processing = false;
        deferedUrl.resolve(self.recordingUrl);
      });
      return deferedUrl.promise;
    };

    self.clear = function () {
      self.recorder.clear();
    };

    self.createUrl = function () {
      if (self.blob) {
        URL.revokeObjectURL(self.recordingUrl);
        self.recordingUrl = URL.createObjectURL(self.blob);
        return self.recordingUrl;
      }
      return false; 
    };
  }
]);

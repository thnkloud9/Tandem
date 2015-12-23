'use strict';

/* audio recorder service. */
angular.module('tandemWebApp').service('recorder', [ 
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
        }
      );

      return deferedInit.promise;
    };

    self.record = function () {
      self.initRecorder().then(function (recorder) {
        self.recorder = recorder;
        self.recorder.record();
        console.log('Started recording');
      });
      self.recording = true;
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

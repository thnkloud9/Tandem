(function () {
'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:RecorderCtrl
 * @description
 * # RecorderCtrl
 * Controller of the tandemWebApp
 */
angular.module('app.audio')
.controller('RecorderCtrl', [
  '$scope',
  '$q',
  'ngAudio',
  'toaster',
  'Recording',
  'Question',
  'Activity',
  'session',
  'recorder',
   function (
    $scope,
    $q,
    ngAudio,
    toaster, 
    Recording,
    Question,
    Activity,
    session,
    recorder) {
    var self = this;

    // instantiate question object
    if (self.questionType !== 'object') {
      var params = {
        "embedded": {
          "submitted_by": 1
        }
      }

      Question.get(self.question, params).then(function (question) {
        self.question = question;
      });
    };
 
    self.speaksCode = session.speaks;
    self.learningCode = session.learning;
    self.speaksText = session.speaksText; 
    self.learningText = session.learningText;

    self.processing = false;
    self.showMicrophone = true;
    self.recordingBlob = null;
    self.recordingQuestion = null; 

    self.startRecording = function () {
      self.updateRecorderDisplay('previewRecording');
      recorder.record();
      self.startRecordCallback();
    };

    self.stopRecording = function (playerId, language) {
      self.updateRecorderDisplay('processing');
      recorder.stop().then(function (url) {
        self.recordingBlob = recorder.blob;
        self.recordingUrl = url;
        self.initPlayer(url, 'previewQueued', 'saveQueued');
        self.stopRecordCallback();
      });
    };

    self.initPlayer = function (url, readyStatus, playedStatus) {
        if (self.player) {
          delete self.player;
        }

        // watch for player errors
        self.clearPlayerErrorWatch();
        self.playerErrorWatch = $scope.$watch(angular.bind(self, function () {
          return self.player.error;
        }), function (newVal, oldVal) {
          if (newVal === true) {
            console.log('player had errors');
            self.updateRecorderDisplay(readyStatus);
          }
        });

        // watch player read
        self.clearPlayerReadyWatch();
        self.playerReadyWatch = $scope.$watch(angular.bind(self, function () {
          return self.player.canPlay;
        }), function (newVal, oldVal) {
          if (newVal === true) {
            console.log('player ready');
            self.updateRecorderDisplay(readyStatus);
            if (self.autoPlay === "true") {
              self.playPreview();
            }
          }
        });

        // track the players progress
        self.clearPlayerProgressWatch();
        self.playerProgressWatch = $scope.$watch(angular.bind(self, function() { 
          return self.player.progress;
        }), function(newVal, oldVal) {
          // TODO: use for progress bar
          self.playerProgress = newVal;
          if (newVal ===  1) {
            self.updateRecorderDisplay(playedStatus);
           }
        });

        self.player = ngAudio.load(url);
        console.log('url loaded');

        /**
        * hack for an intermitten problem loading
        * newly recorded audio
        * this happens usually after around the 5th or 6th recording
        * and I'm still not sure if its a problem with the
        * recorder or the player
        */
        self.bugWatch = setTimeout(function () {
          if ((!self.player.canPlay) && (self.processing)) {
            toaster.pop('error', "Recording Problem", "There was an audio problem.  Please try again in a few moments.");
            recorder.clear();
            recorder.initRecorder();
            self.updateRecorderDisplay('recordingQueued');
          }
        }, 5000);
    };

    self.clearPlayerProgressWatch = function () {
      if (self.playerProgressWatch) {
        self.playerProgressWatch();
      };
    };

    self.clearPlayerReadyWatch = function () {
      if (self.playerReadyWatch) {
        self.playerReadyWatch();
      };
    };

    self.clearPlayerErrorWatch = function () {
      if (self.playerErrorWatch) {
        self.playerErrorWatch();
      };
    };

    self.pausePreview = function () {
      self.player.pause();
      self.updateRecorderDisplay('previewQueued');
    };

    self.playPreview = function () {
      self.player.play();
      self.updateRecorderDisplay('previewPlaying');
    };

    self.saveRecording = function () {
      var deferedSave = $q.defer();
      var blob = self.recordingBlob;
      self.updateRecorderDisplay('processing');

      // only allow one audio per question per user
      if (self.context === 'question') {
        var params = {
          submitted_by: session.userId,
          question: self.question._id,
          language_code: self.language,
          context: self.context
        } 
        Recording.getList({where: params}).then(function (audios) {
          audios.forEach(function (audio) {
            audio.remove();
          });
        }, $q.reject).then(function () {
          Recording.create(blob, self.context, self.language, self.question).then(function (recording) {
            console.log('recording saved');
            self.logActivity(recording);
            self.updateRecorderDisplay('recordingQueued');
            deferedSave.resolve(recording);
            self.saveCallback({ newRecording: recording }); 
          });
        });
      } else {
        // this is the first audio for this question for this user
        Recording.create(blob, self.context, self.language, self.question).then(function (recording) {
          console.log('recording saved');
          self.logActivity(recording);
          self.updateRecorderDisplay('recordingQueued');
          deferedSave.resolve(recording);
          self.saveCallback({ newRecording: recording }); 
        });
      } 
      return deferedSave.promise;
    };

    self.logActivity = function (audio) {
      // save user activity
      var activityData = {
        "action": "added audio",
        "context": self.context,
        "language": self.language,
        "affected_object": audio._id,
        "submitted_by": session.userId
      }
      Activity.post(activityData);
    }

    self.hideAll = function () {
      self.processing = false;
      self.recording = false;
      self.showMicrophone = false;
      self.showPlayPreview = false;
      self.recordinginQueued = false;
      self.previewPlaying = false;
      self.previewRecording = false;
      self.showSave = false;
      self.showComplete = false;
    };

    self.updateRecorderDisplay = function (currentStatus) {
      if (currentStatus === 'processing') {
        self.hideAll();
        self.processing = true;
      };
      if (currentStatus === 'recordingQueued') {
        self.hideAll();
        self.showMicrophone = true;
      };
      if (currentStatus === 'previewRecording') {
        self.hideAll();
        self.recording = true;
      };
      if (currentStatus === 'previewQueued') {
        self.hideAll();
        self.showPlayPreview = true;
        self.showRecorder = true;
      };
      if (currentStatus === 'previewPlaying') {
        self.hideAll();
        self.previewPlaying = true;
      };
      if (currentStatus === 'saveQueued') {
        self.hideAll();
        self.showPlayPreview = true;
        self.showMicrophone = true;
        self.showSave = true;
      };
      if (currentStatus === 'completed') {
        self.hideAll();
        self.showComplete = true;
      };
    };

  }
]);
})();

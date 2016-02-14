(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name tandemWebApp.controller:AudioPlayerCtrl
     * @description
     * # AudioPlayerCtrl
     * Controller of the tandemWebApp
     */
    angular.module('app.audio').controller('AudioPlayerCtrl', [
      '$scope',
      'toaster',
      'ngAudio',
      'Recording',
      'Comment',
      'session',
       function (
        $scope,
        toaster,
        ngAudio, 
        Recording, 
        Comment,
        session) {
        var self = this;
     
        self.processing = true;
        self.player = false;
        self.comments = [];
        self.showComment = false;

        // sets watch vars for player object
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
              self.updatePlayerDisplay(readyStatus);
            }
          });

          // watch player read
          self.clearPlayerReadyWatch();
          self.playerReadyWatch = $scope.$watch(angular.bind(self, function () {
            return self.player.canPlay;
          }), function (newVal, oldVal) {
            if (newVal === true) {
              console.log('player ready');
              self.playerEnd = self.player.remaining;
              self.updatePlayerDisplay(readyStatus);

              // auto play if set
              if (self.autoPlay === "true") {
                if (self.context === 'question') {
                   self.playQuestion();
                }
                if (self.context === 'answer') {
                   self.playAnswer();
                }
              }
            }
          });

          // track the players progress
          self.clearPlayerProgressWatch();
          self.playerProgressWatch = $scope.$watch(angular.bind(self, function() { 
            return self.player.progress;
          }), function(newVal, oldVal) {
            var roundedTime = Math.round(newVal * 100) / 100;
            // when the audio is done playing
            if (newVal ===  1) {
              self.updatePlayerDisplay(playedStatus);
              self.stopCallback();  
            }

            angular.forEach(self.comments, function(comment) {
              var commentRoundedTime = Math.round(comment.progress * 100) / 100;
              if (commentRoundedTime === roundedTime) {
                $scope.$emit('show-timeline-comment', comment);
              }
            });
          });
          
          self.player = ngAudio.load(url);
          if (self.timeline === "true") {
            self.loadTimelineComments();
          } 
        };

        self.loadTimelineComments = function () {
          // load comments
          var params = {
            "where": {
              "parent": self.recording._id,
              "progress": {$ne: null}
            },
            "sort": "progress"
          }
          Comment.getList(params).then(function (comments) {
            self.comments = comments;
            $scope.$emit('update-timeline-comments', comments);
          });
        };

        self.saveComment = function () {
          var newComment = {
            "submitted_by": session.userId,
            "username": session.username,
            "progress": self.player.progress,
            "affected_user": self.recording.submitted_by._id,
            "context": self.recording.context,
            "language_code": self.recording.language_code,
            "parent": self.recording._id,
            "text": self.userComment
          }

          Comment.post(newComment).then(function (response) {
            Comment.get(response._id).then(function (comment) {
              self.comments.push(comment);
              self.userComment = null;
              $scope.$emit('update-timeline-comments', self.comments);
            });
            toaster.pop('success', 'Comment Saved', 'Thanks!');
          }, function (response) {
            toaster.pop('error', 'Server Error', 'Please try again in a moment.');
          });
        }

        self.playQuestion = function () {
          self.player.play();
          self.updatePlayerDisplay('questionPlaying');
        };

        self.playAnswer = function () {
          self.player.play();
          self.updatePlayerDisplay('answerPlaying');
        };

        self.pauseQuestion = function () {
          self.player.pause();
          self.updatePlayerDisplay('questionQueued');
        };

        self.pauseAnswer = function () {
          self.player.pause();
          self.updatePlayerDisplay('answerQueued');
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
     
        self.updatePlayerDisplay = function (currentStatus) {
          if (currentStatus === 'processing') {
            self.processing = true;
            self.showPlayAnswer = false;
            self.showPlayQuestion = false;
            self.playingQuestion = false;
            self.playingAnswer = false;
            self.showComplete = false;
          };
          if (currentStatus === 'questionQueued') {
            self.processing = false;
            self.showPlayAnswer = false;
            self.showPlayQuestion = true;
            self.playingQuestion = false;
            self.playingAnswer = false;
            self.showComplete = false;
          };
          if (currentStatus === 'questionPlaying') {
            self.processing = false;
            self.showPlayAnswer = false;
            self.showPlayQuestion = false;
            self.playingQuestion = true;
            self.playingAnswer = false;
            self.showComplete = false;
          };
          if (currentStatus === 'answerQueued') {
            self.processing = false;
            self.showPlayAnswer = true;
            self.showPlayQuestion = false;
            self.playingQuestion = false;
            self.playingAnswer = false;
            self.showComplete = false;
          };
          if (currentStatus === 'answerPlaying') {
            self.processing = false;
            self.showPlayAnswer = false;
            self.showPlayQuestion = false;
            self.playingQuestion = false;
            self.playingAnswer = true;
            self.showComplete = false;
          };
          if (currentStatus === 'completed') {
            self.processing = false;
            self.showPlayAnswer = false;
            self.showPlayQuestion = false;
            self.playingQuestion = false;
            self.playingAnswer = false;
            self.showComplete = true;
          };
        };

        self.updatePlayerDisplay('processing');
        if (self.recording) {
          if (!self.url) {
            Recording.get(self.recording._id).then(function (recording) {
              var blob = recording.createBlob();
              self.url = URL.createObjectURL(blob);
              self.initPlayer(self.url, self.context + 'Queued', self.context + 'Queued');
            });
          }
        }

        self.urlWatch = $scope.$watch(angular.bind(self, function() { 
          return self.url;
        }), function(newVal, oldVal) {
          var pattern = /^(blob:)?https?.+$/;
          if (pattern.test(newVal)) {
            self.url = newVal;
            self.initPlayer(self.url, self.context + 'Queued', self.context + 'Queued');
          }
        });

      }
    ]);
})();

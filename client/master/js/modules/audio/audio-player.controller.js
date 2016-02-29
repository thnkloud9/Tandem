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
        var vm = this;
     
        vm.processing = true;
        vm.player = false;
        vm.comments = [];
        vm.showComment = false;

        // sets watch vars for player object
        vm.initPlayer = function (url, readyStatus, playedStatus) {
          if (vm.player) {
            delete vm.player;
          }

          // watch for player errors
          vm.clearPlayerErrorWatch();
          vm.playerErrorWatch = $scope.$watch(angular.bind(vm, function () {
            return vm.player.error;
          }), function (newVal, oldVal) {
            if (newVal === true) {
              console.log('player had errors');
              vm.updatePlayerDisplay(readyStatus);
            }
          });

          // watch player read
          vm.clearPlayerReadyWatch();
          vm.playerReadyWatch = $scope.$watch(angular.bind(vm, function () {
            return vm.player.canPlay;
          }), function (newVal, oldVal) {
            if (newVal === true) {
              console.log('player ready');
              vm.playerEnd = vm.player.remaining;
              vm.updatePlayerDisplay(readyStatus);

              // auto play if set
              if (vm.autoPlay === "true") {
                if (vm.context === 'question') {
                   vm.playQuestion();
                }
                if (vm.context === 'answer') {
                   vm.playAnswer();
                }
              }
            }
          });

          // track the players progress
          vm.clearPlayerProgressWatch();
          vm.playerProgressWatch = $scope.$watch(angular.bind(vm, function() { 
            return vm.player.progress;
          }), function(newVal, oldVal) {
            var roundedTime = Math.round(newVal * 100) / 100;
            // when the audio is done playing
            if (newVal ===  1) {
              vm.updatePlayerDisplay(playedStatus);
              vm.stopCallback();  
            }

            angular.forEach(vm.comments, function(comment) {
              var commentRoundedTime = Math.round(comment.progress * 100) / 100;
              if (commentRoundedTime === roundedTime) {
                $scope.$emit('show-timeline-comment', comment);
              }
            });
          });
          
          vm.player = ngAudio.load(url);
          if (vm.timeline === "true") {
            vm.loadTimelineComments();
          } 
        };

        vm.loadTimelineComments = function () {
          // load comments
          var params = {
            "where": {
              "parent": vm.recording._id,
              "progress": {$ne: null}
            },
            "sort": "progress"
          }
          Comment.getList(params).then(function (comments) {
            vm.comments = comments;
            $scope.$emit('update-timeline-comments', comments);
          });
        };

        vm.saveComment = function () {
          var newComment = {
            "submitted_by": session.userId,
            "username": session.username,
            "progress": vm.player.progress,
            "affected_user": vm.recording.submitted_by._id,
            "context": vm.recording.context,
            "language_code": vm.recording.language_code,
            "parent": vm.recording._id,
            "text": vm.userComment
          }

          Comment.post(newComment).then(function (response) {
            Comment.get(response._id).then(function (comment) {
              vm.comments.push(comment);
              vm.userComment = null;
              $scope.$emit('update-timeline-comments', vm.comments);
            });
            toaster.pop('success', 'Comment Saved', 'Thanks!');
          }, function (response) {
            toaster.pop('error', 'Server Error', 'Please try again in a moment.');
          });
        }

        vm.playQuestion = function () {
          vm.player.play();
          vm.updatePlayerDisplay('questionPlaying');
        };

        vm.playAnswer = function () {
          vm.player.play();
          vm.updatePlayerDisplay('answerPlaying');
        };

        vm.pauseQuestion = function () {
          vm.player.pause();
          vm.updatePlayerDisplay('questionQueued');
        };

        vm.pauseAnswer = function () {
          vm.player.pause();
          vm.updatePlayerDisplay('answerQueued');
        };

        vm.clearPlayerProgressWatch = function () {
          if (vm.playerProgressWatch) {
            vm.playerProgressWatch();
          };
        };

        vm.clearPlayerReadyWatch = function () {
          if (vm.playerReadyWatch) {
            vm.playerReadyWatch();
          };
        };

        vm.clearPlayerErrorWatch = function () {
          if (vm.playerErrorWatch) {
            vm.playerErrorWatch();
          };
        };
     
        vm.updatePlayerDisplay = function (currentStatus) {
          if (currentStatus === 'processing') {
            vm.processing = true;
            vm.showPlayAnswer = false;
            vm.showPlayQuestion = false;
            vm.playingQuestion = false;
            vm.playingAnswer = false;
            vm.showComplete = false;
          };
          if (currentStatus === 'questionQueued') {
            vm.processing = false;
            vm.showPlayAnswer = false;
            vm.showPlayQuestion = true;
            vm.playingQuestion = false;
            vm.playingAnswer = false;
            vm.showComplete = false;
          };
          if (currentStatus === 'questionPlaying') {
            vm.processing = false;
            vm.showPlayAnswer = false;
            vm.showPlayQuestion = false;
            vm.playingQuestion = true;
            vm.playingAnswer = false;
            vm.showComplete = false;
          };
          if (currentStatus === 'answerQueued') {
            vm.processing = false;
            vm.showPlayAnswer = true;
            vm.showPlayQuestion = false;
            vm.playingQuestion = false;
            vm.playingAnswer = false;
            vm.showComplete = false;
          };
          if (currentStatus === 'answerPlaying') {
            vm.processing = false;
            vm.showPlayAnswer = false;
            vm.showPlayQuestion = false;
            vm.playingQuestion = false;
            vm.playingAnswer = true;
            vm.showComplete = false;
          };
          if (currentStatus === 'completed') {
            vm.processing = false;
            vm.showPlayAnswer = false;
            vm.showPlayQuestion = false;
            vm.playingQuestion = false;
            vm.playingAnswer = false;
            vm.showComplete = true;
          };
        };

        vm.updatePlayerDisplay('processing');
        if (vm.recording) {
          if (!vm.url) {
            Recording.get(vm.recording._id).then(function (recording) {
              var blob = recording.createBlob();
              vm.url = URL.createObjectURL(blob);
              vm.initPlayer(vm.url, vm.context + 'Queued', vm.context + 'Queued');
            });
          }
        }

        vm.urlWatch = $scope.$watch(angular.bind(vm, function() { 
          return vm.url;
        }), function(newVal, oldVal) {
          var pattern = /^(blob:)?https?.+$/;
          if (pattern.test(newVal)) {
            vm.url = newVal;
            vm.initPlayer(vm.url, vm.context + 'Queued', vm.context + 'Queued');
          }
        });

      }
    ]);
})();

'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:ModalReviewPracticeSessionCtrl
 * @description
 * # ModalReviewPracticeSessionCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('ModalReviewPracticeSessionCtrl', [
  '$q',
  '$scope',
  '$aside',
  'ngAudio',
  'config',
  'Recording',
  'PracticeSession',
  'session',
   function ($q, $scope, $aside, ngAudio, config, Recording, PracticeSession, session) {
    var self = this;
 
    self.speaksCode = session.speaks;
    self.learningCode = session.learning;

    self.practiceSession = session.reviewingPracticeSession;
    $scope.$watch(angular.bind(session, function () {
      return session.reviewingPracticeSession;
    }), function (newVal, oldVal) {
      var practiceSessionId = newVal._id;
      var params = {
        "embedded": {
          "audio": 1
        }
      };
      PracticeSession.get(practiceSessionId, params).then(function (practiceSession) {
        self.practiceSession = practiceSession;
      });
    });

    self.showTranscribe = function (audio) {
      var asideInstance = $aside.open({
        templateUrl: 'views/aside-recording-transcribe.html',
        placement: 'right',
        size: 'sm'
      });
    };

    self.showComment = function (recording) {
      session.commentingRecording = recording;
      var asideInstance = $aside.open({
        templateUrl: 'views/aside-recording-comments.html',
        controller: 'CommentsCtrl',
        controllerAs: 'commentsCtrl',
        placement: 'right',
        size: 'sm'
      });
    };
  }
]);

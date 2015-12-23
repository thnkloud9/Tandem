'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
  .controller('MainCtrl', [
  '$scope',
  '$q',
  '$location',
  '$modal',
  'toaster',
  'PracticeSet',
  'User',
  'session',
  function ($scope, $q, $location, $modal, toaster, PracticeSet, User, session) {
    var self = this;

    self.sessionWatch = $scope.$watch(angular.bind(session, function() { 
      return session.userId;
    }), function(newVal, oldVal) {
      if (session.user) {
        User.initUserStats(session.user).then(function (user) {
          user.checkProfile();
          self.user = user;
        });
      }
    });

    self.playIntroductionPracticeSetModal = function () {
      if (session.userId) {
        var params = {
          "where": {
            "submitted_by": session.userId, 
            "title": "Introduction"
          }
        }

        PracticeSet.getList(params).then(function (practiceSets) { 
          var practiceSet = practiceSets[0];
          session.playingPracticeSet = practiceSet;
          $modal.open({
            controller: 'ModalPlayPracticeSetCtrl',
            controllerAs: 'modalPlayPracticeSetCtrl',
            templateUrl: 'views/modal-play-practice-set.html'
          });
        });
      }
      $location.path('/practice-sets');
    };

    self.showTutorModal = function () {
      $modal.open({
        controller: 'ModalTutorCtrl',
        controllerAs: 'modalTutorCtrl',
        templateUrl: 'views/modal-tutor.html',
        size: 'lg'
      });
    };

    self.showMyResponses = function () {
      $modal.open({
        controller: 'ModalMyResponsesCtrl',
        controllerAs: 'modalMyResponsesCtrl',
        templateUrl: 'views/modal-my-responses.html',
        size: 'lg'
      });
    };

    self.showMyComments = function () {
      $modal.open({
        controller: 'ModalMyCommentsCtrl',
        controllerAs: 'modalMyCommentsCtrl',
        templateUrl: 'views/modal-my-comments.html'
      });
    };

  }
]);

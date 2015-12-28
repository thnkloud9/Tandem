'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:ModalConfigurePracticeSetctrl
 * @description
 * # ModalPlayPracticeSetctrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('ModalConfigurePracticeSetCtrl', [
  '$scope',
  '$http',
  '$modal',
  'toaster',
  'PracticeSet',
  'session',
  'config',
   function ($scope, $http, $modal, toaster, PracticeSet, session, config) {
    var self = this;

    self.isAdmin = (session.roles === "admin");
    self.configuringPracticeSet = session.configuringPracticeSet;
    $scope.$watch(angular.bind(session, function () {
      return session.configuringPracticeSet;
    }), function (newVal, oldVal) {
      self.practiceSet = newVal;
    });

    self.createQuestionModal = function () {
      // TODO: set practice_set id to ensure new questions are added to this practice_set
      $modal.open({
        controller: 'QuestionsCtrl',
        controllerAs: 'questionsCtrl',
        templateUrl: 'views/modal-create-question.html'
      });
    };

    self.savePracticeSet = function () {
      var practiceSetData = {};
      practiceSetData.category = self.practiceSet.category;
      PracticeSet.one(self.configuringPracticeSet._id).patch(practiceSetData).then(function() {
        toaster.pop('success', "Practice Set Updated", "The practice set has been updated succefully.");
      }, function () {
        toaster.pop('error', "Server Problem", "Please try again in a few moments.");
      });
    }
  }
]);

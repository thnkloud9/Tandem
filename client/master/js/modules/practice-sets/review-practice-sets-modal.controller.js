(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name tandemWebApp.controller:ModalPlayPracticeSetctrl
   * @description
   * # ModalPlayPracticeSetctrl
   * Controller of the tandemWebApp
   */
  angular.module('app.practiceSets')
  .controller('ReviewPracticeSetModalController', [
    '$scope',
    '$http',
    'Notify',
    'PracticeSet',
    'PracticeSession',
    'session',
    'APP_CONFIG',
    'practiceSet',
    function (
      $scope,
      $http,
      Notify,
      PracticeSet,
      PracticeSession,
      session,
      APP_CONFIG,
      practiceSet
    ) {
      var vm = this;
      vm.practiceSet = practiceSet;
      vm.practiceSessions = [];

      var params = {
        where: {
          practice_set: practiceSet._id
        },
        embedded: {
          submitted_by: 1,
          practice_set: 1,
          questions: 1,
          answers: 1
        },
        max_results: 9999 
      };
      PracticeSession.getList(params).then(function (practiceSessions) {
        vm.practiceSessions = practiceSessions;
console.log(practiceSessions);
      });

      activate();

      ////////////////

      function activate() {

        vm.selectSession = function () {
        };

        vm.saveReview = function () {
        };

      }
    }
  ]);
})();

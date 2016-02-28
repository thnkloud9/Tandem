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
    'speechSynth',
    'practiceSet',
    function (
      $scope,
      $http,
      Notify,
      PracticeSet,
      PracticeSession,
      session,
      APP_CONFIG,
      speechSynth,
      practiceSet
    ) {
      var vm = this;
      vm.practiceSet = practiceSet;
      vm.practiceSessions = [];
      vm.reviewSession = null;

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
      });

      activate();

      ////////////////

      function activate() {

        vm.loadSession = function (session) {
          // load audio and all embedded objects.  by default
          // only audio _ids are stored in the session audio array
          session.initTimeline().then(function (s) {
            vm.reviewSession = s;
            // use the date of the first answer as the start date
            vm.sessionStarted = s.timelineEvents[1].audio._created;
          });
        };

        vm.saveReview = function () {
        };

        vm.speak = function (text) {
          speechSynth.speak(text, session.learning);
        };

      }
    }
  ]);
})();

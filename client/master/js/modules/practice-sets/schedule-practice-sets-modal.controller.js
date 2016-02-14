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
  .controller('SchedulePracticeSetModalController', [
    '$scope',
    '$http',
    'Notify',
    'PracticeSet',
    'session',
    'APP_CONFIG',
    'practiceSetId',
     function ($scope, $http, Notify, PracticeSet, session, APP_CONFIG, practiceSetId) {
      var self = this;

      self.format = 'dd-MMMM-yyyy HH:m';
      self.scheduleDate = new Date();
      self.minDate = new Date();
      self.timezone = self.scheduleDate.getTimezoneOffset();
      self.opened = false;
      self.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      self.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        self.opened = true;
      }

      self.saveSchedule = function () {
        // TODO: send user timezone
        var data = {
          "when": self.scheduleDate.toISOString(),
          "user_timezone": self.timezone,
          "repeat": false
        }
        var request = {
          method: 'POST',
          url: APP_CONFIG.API.rootURI + '/mobile/schedule/' + practiceSetId,
          data: data
        }

        $http(request)
        .success(function (response) {
          Notify.alert('Scheduled Save.', {status: 'succes'});
        })
        .error(function (response) {
          Notify.alert('Server Error, Please try again in a moment.', {status: 'error'});
        })
      }
    }
  ]);
})();

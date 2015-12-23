'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:ModalPlayPracticeSetctrl
 * @description
 * # ModalPlayPracticeSetctrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('ModalSchedulePracticeSetCtrl', [
  '$scope',
  '$http',
  'toaster',
  'PracticeSet',
  'session',
  'config',
   function ($scope, $http, toaster, PracticeSet, session, config) {
    var self = this;

    self.schedulingPracticeSet = session.schedulingPracticeSet;
    $scope.$watch(angular.bind(session, function () {
      return session.schedulingPracticeSet;
    }), function (newVal, oldVal) {
      self.practiceSet = newVal;
    });

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
        url: config.API.rootURI + '/mobile/schedule/' + self.practiceSet._id,
        data: data
      }

      $http(request)
      .success(function (response) {
        toaster.pop('success', 'Scheduled Save', 'Talk to you soon!');
      })
      .error(function (response) {
        toaster.pop('error', 'Server Error', 'Please try again in a moment.');
      })
    }
  }
]);

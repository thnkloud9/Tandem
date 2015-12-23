'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:LeaderboardCtrl
 * @description
 * # LeaderboardCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('LeaderboardCtrl', [
  'config',
  'User',
  'session',
   function (config, User, session) {
    var self = this;

    var params = {
      "sort": "-points",
      "max_results": 10
    }
    User.getList(params).then(function (users) {
      self.leaders = users;
    });

  }
]);


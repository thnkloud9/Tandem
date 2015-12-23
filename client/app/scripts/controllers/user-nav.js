'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:QuestionsCtrl
 * @description
 * # UserNavCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
  .controller('UserNavCtrl', function ($scope, $http, session) {
    $scope.session = session;
    $scope.username = session.username;
  });

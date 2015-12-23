'use strict';
  
angular.module('tandemWebApp').directive('leaderboard', function () {                             
    return {
        templateUrl: 'views/leaderboard.html',
        restrict: 'E',
        controller: 'LeaderboardCtrl', 
        controllerAs: 'leaderboardCtrl',
        bindToController: true,
        scope: {
            sort: '@'
        }
    };      
});

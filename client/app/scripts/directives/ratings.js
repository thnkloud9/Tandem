'use strict';
  
angular.module('tandemWebApp').directive('ratings', function () {                             
    return {
        templateUrl: 'views/ratings.html',
        restrict: 'E',
        controller: 'RatingsCtrl', 
        controllerAs: 'ratingsCtrl', 
        bindToController: true,
        scope: {
          element: '=',
          context: '@',
          onSave: '&onSave'
        }
    };      
});

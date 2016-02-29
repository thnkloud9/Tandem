'use strict';
  
angular.module('app.ratings').directive('ratings', function () {                             
    return {
        templateUrl: 'app/views/ratings.html',
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

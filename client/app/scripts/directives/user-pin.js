'use strict';
  
angular.module('tandemWebApp').directive('userPin', function () {                             
    return {
        templateUrl: 'views/user-pin.html',
        restrict: 'E',
        controller: 'UserPinCtrl', 
        controllerAs: 'userPinCtrl', 
        bindToController: true,
        scope: {
          user: '=',
          imageClass: '@',
          noImageClass: '@'
        }
    };      
});

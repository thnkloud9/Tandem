'use strict';
  
angular.module('tandemWebApp').directive('flagIcon', function () {                             
    return {
        template: '<span class="label flag-label"> <span class="{{ flagClass }}"></span> {{ languageCode | uppercase }} </span>',
        restrict: 'E',
        scope: {
          languageCode: '@'
        },
        link: function (scope, el, attr) {
          var flag = (scope.languageCode === 'en') ? 'gb' : scope.languageCode;
          scope.flagClass = 'flag-icon flag-icon-' + flag;
        }
    };      
});

'use strict';
  
angular.module('tandemWebApp').directive('whenScrolled', function () {
    return {
        restrict: 'A',
        scope: {
          whenScrolled: '&whenScrolled'
        },
        link: function (scope, element, attrs) {
            var raw = element[0];
                
            element.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply();
                    scope.whenScrolled();
                }
            });
        }
    };
});

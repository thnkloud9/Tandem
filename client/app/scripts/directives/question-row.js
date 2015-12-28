'use strict';
  
angular.module('tandemWebApp').directive('questionRow', function () {
    return {
        templateUrl: 'views/question-row.html',
        restrict: 'E',
        controller: 'QuestionCardCtrl', 
        controllerAs: 'questionCardCtrl',
        bindToController: true,
        scope: {
            question: '='
        }
    };      
});

'use strict';
  
angular.module('tandemWebApp').directive('questionCard', function () {                             
    return {
        templateUrl: 'views/question-card.html',
        restrict: 'E',
        controller: 'QuestionCardCtrl', 
        controllerAs: 'questionCardCtrl',
        bindToController: true,
        scope: {
            question: '='
        }
    };      
});

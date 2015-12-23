'use strict';
  
angular.module('tandemWebApp').directive('recorder', function () {                             
    return {
        templateUrl: 'views/recorder.html',
        restrict: 'E',
        controller: 'RecorderCtrl', 
        controllerAs: 'recorderCtrl',
        bindToController: true,
        scope: {
            question: '=',
            questionType: '@',
            context: '@', // question or answer
            language: '@',
            autoPlay: '@',
            startRecordCallback: '&onStartRecord',
            stopRecordCallback: '&onStopRecord',
            saveCallback: '&onSave',
        }
    };      
});

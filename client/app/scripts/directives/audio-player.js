'use strict';
  
angular.module('tandemWebApp').directive('audioPlayer', function () {                             
    return {
        templateUrl: 'views/audio-player.html',
        restrict: 'E',
        controller: 'AudioPlayerCtrl', 
        controllerAs: 'audioPlayerCtrl', 
        bindToController: true,
        scope: {
          recording: '=',
          url: '@',
          context: '@',
          autoPlay: '@',
          timeline: '@',
          playCallback: '&onPlay',
          stopCallback: '&onStop',
          clickCallback: '&onTimelineClick'
        }
    };      
});

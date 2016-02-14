(function() {
  'use strict';
  
  angular.module('app.audio').directive('audioPlayer', function () {                             
    return {
        templateUrl: 'app/views/audio-player.html',
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
})();

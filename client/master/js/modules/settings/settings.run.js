(function() {
    'use strict';

    angular
        .module('app.settings')
        .run(settingsRun);

    settingsRun.$inject = ['$rootScope', '$localStorage'];

    function settingsRun($rootScope, $localStorage){

      // Global Settings
      // -----------------------------------
      $rootScope.app = {
        name: 'Tandem',
        description: 'Language Practice App',
        year: ((new Date()).getFullYear()),
        debug: false,
        layout: {
          isFixed: true,
          isCollapsed: true,
          isBoxed: false,
          isRTL: false,
          horizontal: false,
          isFloat: false,
          asideHover: false,
          theme: null,
          asideScrollbar: false,
          userBlockVisible: true
        },
        translation: {
          mymemory: true,
          duolingo: true,
          googleSearch: true,
          leoLink: true,
          to: 'en',
          show: true
        },
        useFullLayout: false,
        hiddenFooter: false,
        offsidebarOpen: false,
        asideToggled: false,
        viewAnimation: 'ng-fadeInUp',
        audio: {
          speechRecognition: true
        }
      };

      // Setup the layout mode
      $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout === 'app-h') ;

      // Restore layout settings
      if( angular.isDefined($localStorage.layout) )
        $rootScope.app.layout = $localStorage.layout;
      else
        $localStorage.layout = $rootScope.app.layout;

      $rootScope.$watch('app.layout', function () {
        $localStorage.layout = $rootScope.app.layout;
      }, true);

      // Restore translation settings
      if( angular.isDefined($localStorage.translation) )
        $rootScope.app.translation = $localStorage.translation;
      else
        $localStorage.translation = $rootScope.app.translation;

      $rootScope.$watch('app.translation', function () {
        $localStorage.translation = $rootScope.app.translation;
      }, true);

      // Restore audio settings
      if( angular.isDefined($localStorage.audio) )
        $rootScope.app.audio = $localStorage.audio;
      else
        $localStorage.audio = $rootScope.app.audio;

      $rootScope.$watch('app.audio', function () {
        $localStorage.audio = $rootScope.app.audio;
      }, true);

      // Close submenu when sidebar change from collapsed to normal
      $rootScope.$watch('app.layout.isCollapsed', function(newValue) {
        if( newValue === false )
          $rootScope.$broadcast('closeSidebarMenu');
      });

    }

})();

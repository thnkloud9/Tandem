/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/app/dashboard');

        // 
        // Application Routes
        // -----------------------------------   
        $stateProvider
          .state('app', {
              url: '/app',
              abstract: true,
              templateUrl: helper.basepath('app.html'),
              resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
          })
          .state('app.dashboard', {
              url: '/dashboard',
              title: 'Dashboard',
              templateUrl: helper.basepath('dashboard.html'),
              resolve: helper.resolveFor('ui.select')
          })
          .state('app.tandems', {
              url: '/tandems',
              title: 'Tandems',
              templateUrl: helper.basepath('tandems.html'),
              resolve: helper.resolveFor('ngDialog')
          })
          .state('app.word-lists', {
              url: '/word-lists',
              title: 'Word Lists',
              templateUrl: helper.basepath('word-lists.html'),
              resolve: helper.resolveFor('ngDialog')
          })
          .state('app.questions', {
              url: '/questions',
              title: 'Questions',
              templateUrl: helper.basepath('questions.html'),
              resolve: helper.resolveFor('ngDialog', 'infinite-scroll', 'xeditable')
          })
          .state('app.tags', {
              url: '/tags',
              title: 'Tags',
              templateUrl: helper.basepath('tags.html'),
              resolve: helper.resolveFor('ngDialog')
          })
          .state('app.singleview', {
              url: '/singleview',
              title: 'Single View',
              templateUrl: helper.basepath('singleview.html')
          })
          .state('app.chart-flot', {
              url: '/chart-flot',
              title: 'Chart Flot',
              templateUrl: helper.basepath('chart-flot.html'),
              resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
          })
          .state('app.icons-weather', {
              url: '/icons-weather',
              title: 'Icons Weather',
              templateUrl: helper.basepath('icons-weather.html'),
              resolve: helper.resolveFor('weather-icons', 'skycons')
          })
          .state('app.profile', {
              url: '/profile',
              title: 'Profile',
              templateUrl: helper.basepath('profile.html'),
              resolve: helper.resolveFor('ngImgCrop', 'filestyle', 'ngDialog', 'moment', 'xeditable', 'ui.map')
          })
          //
          // Admin Page Routes
          // -----------------------------------
          .state('admin', {
              url: '/admin',
              abstract: true,
              templateUrl: helper.basepath('app.html'),
              resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
          })
          .state('admin.practice-sessions', {
              url: '/practice-sessions',
              title: 'Practice Sessions',
              templateUrl: helper.basepath('admin/practice-sessions.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.practice-sets', {
              url: '/practice-sets',
              title: 'Practice Sets',
              templateUrl: helper.basepath('admin/practice-sets.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.questions', {
              url: '/questions',
              title: 'Questions',
              templateUrl: helper.basepath('admin/questions.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.tags', {
              url: '/tags',
              title: 'Tags',
              templateUrl: helper.basepath('admin/tags.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.audio', {
              url: '/audio',
              title: 'Audio',
              templateUrl: helper.basepath('admin/audio.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.users', {
              url: '/users',
              title: 'Users',
              templateUrl: helper.basepath('admin/users.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.ratings', {
              url: '/ratings',
              title: 'Ratings',
              templateUrl: helper.basepath('admin/ratings.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.comments', {
              url: '/comments',
              title: 'Comments',
              templateUrl: helper.basepath('admin/comments.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          //
          // Single Page Routes
          // -----------------------------------
          .state('page', {
              url: '/page',
              templateUrl: 'app/pages/page.html',
              resolve: helper.resolveFor('modernizr', 'icons'),
              controller: ['$rootScope', function($rootScope) {
                  $rootScope.app.layout.isBoxed = false;
              }]
          })
          .state('page.login', {
              url: '/login',
              title: 'Login',
              templateUrl: 'app/pages/login.html'
          })
          .state('page.register', {
              url: '/register',
              title: 'Register',
              templateUrl: 'app/pages/register.html'
          })
          .state('page.recover', {
              url: '/recover',
              title: 'Recover',
              templateUrl: 'app/pages/recover.html'
          })
          .state('page.lock', {
              url: '/lock',
              title: 'Lock',
              templateUrl: 'app/pages/lock.html'
          })
          .state('page.404', {
              url: '/404',
              title: 'Not Found',
              templateUrl: 'app/pages/404.html'
          })
          ;

    } // routesConfig

})();


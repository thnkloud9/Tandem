'use strict';

/**
 * @ngdoc overview
 * @name tandemWebApp
 * @description
 * # tandemWebApp
 *
 * Main module of the application.
 */
angular
  .module('tandemWebApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMessages',
    'ngTouch',
    'ngAudio',
    'angularFileUpload',
    'restangular',
    'ui.bootstrap',
    'ngAside',
    'rt.popup',
    'ui.select',
    'internationalPhoneNumber',
    'toaster',
    'dndLists',
  ]).config([
    '$routeProvider',
    '$httpProvider',
    'RestangularProvider',
    function ($routeProvider, $httpProvider, RestangularProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controllerAs: 'mainCtrl',
        controller: 'MainCtrl'
      })
      .when('/questions', {
        templateUrl: 'views/questions.html',
        controllerAs: 'questionsCtrl',
        controller: 'QuestionsCtrl'
      })
      .when('/practice-sets', {
        templateUrl: 'views/practice-sets.html',
        controllerAs: 'practiceSetsCtrl',
        controller: 'PracticeSetsCtrl'
      })
      .when('/review', {
        templateUrl: 'views/review.html',
        controllerAs: 'reviewCtrl',
        controller: 'ReviewCtrl'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controllerAs: 'profileCtrl',
        controller: 'ProfileCtrl'
      })
      .when('/users/:userId?', {
        templateUrl: 'views/users.html',
        controllerAs: 'usersCtrl',
        controller: 'UsersCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controllerAs: 'aboutCtrl',
        controller: 'AboutCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controllerAs: 'contactCtrl',
        controller: 'ContactCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controllerAs: 'signupCtrl',
        controller: 'SignupCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  
      // restangular config
      // TODO: use config setting here, not hard coded
      RestangularProvider.setBaseUrl('http://localhost:5000/api/v1');
      RestangularProvider.setRestangularFields({
        id: '_id',
        selfLink: 'self.href'
      });
      RestangularProvider.addFullRequestInterceptor(function(element, operation, route, url, headers) {
        if ((operation === 'patch') || (operation === 'put')) {
          delete element._id;
          delete element._created;
          delete element._updated;
          delete element._links;
          delete element._etag;
        }
        return {
          element: element
        }
      });
      RestangularProvider.setResponseExtractor(function(response, operation) {
        if (operation === 'getList') {
            var results = response._items;
            results._meta = response._meta;
            return response._items;
        }
        return response;
      });

      // intercept to add auth token 
      $httpProvider.interceptors.push('authInterceptor');  
    }
  ]).run(['$window', 'checkAuth', function($window, checkAuth) {

    checkAuth();

  }]);

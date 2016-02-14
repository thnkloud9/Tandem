(function() {
    'use strict';

    angular
        .module('app.core')
        .config(coreConfig);

    coreConfig.$inject = [
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        '$animateProvider',
        '$httpProvider',
        'RestangularProvider',
        'APP_CONFIG'
    ];
    function coreConfig(
        $controllerProvider,
        $compileProvider,
        $filterProvider,
        $provide,
        $animateProvider,
        $httpProvider,
        RestangularProvider,
        APP_CONFIG){

      var core = angular.module('app.core');
      // registering components after bootstrap
      core.controller = $controllerProvider.register;
      core.directive  = $compileProvider.directive;
      core.filter     = $filterProvider.register;
      core.factory    = $provide.factory;
      core.service    = $provide.service;
      core.constant   = $provide.constant;
      core.value      = $provide.value;

      // Disables animation on items with class .ng-no-animation
      $animateProvider.classNameFilter(/^((?!(ng-no-animation)).)*$/);
        
      // restangular config
      RestangularProvider.setBaseUrl(APP_CONFIG.API.full);
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

})();

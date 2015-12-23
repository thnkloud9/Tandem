'use strict';

/**
* A factory which creates a question model.
*
* @class Activity
*/
angular.module('tandemWebApp')
  .factory('Activity', [
    '$q',
    '$http',
    'Restangular',
    'config',
    'session',
    function ($q, $http, Restangular, config, session) {
      var Activity = Restangular.all('activities');

      // extend collection 
      Restangular.extendCollection('activities', function(collection) {
        return collection;
      });

      // extend model
      Restangular.extendModel('activities', function(model) {
        return model;
      });

      return Activity;
    }
]);

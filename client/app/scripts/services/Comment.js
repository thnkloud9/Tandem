'use strict';

/**
* A factory which creates a question model.
*
* @class Comment
*/
angular.module('tandemWebApp')
  .factory('Comment', [
    '$q',
    '$http',
    'Restangular',
    'config',
    'session',
    function ($q, $http, Restangular, config, session) {
      var Comment = Restangular.all('comments');

      // extend collection 
      Restangular.extendCollection('comments', function(collection) {
        return collection;
      });

      // extend model
      Restangular.extendModel('comments', function(model) {
        return model;
      });

      return Comment;
    }
]);

(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Comment', [
            '$q',
            '$http',
            'Restangular',
            function ($q, $http, Restangular) {
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
})();

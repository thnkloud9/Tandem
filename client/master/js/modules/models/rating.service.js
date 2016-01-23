(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Rating', [
            '$q',
            '$http',
            'Restangular',
            function ($q, $http, Restangular) {
              var Rating = Restangular.all('ratings');

              // extend collection 
              Restangular.extendCollection('ratings', function(collection) {
                return collection;
              });

              // extend model
              Restangular.extendModel('ratings', function(model) {
                return model;
              });

              return Rating;
            }
        
        ]);
})();

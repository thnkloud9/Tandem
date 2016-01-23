(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Activity', [
            '$q',
            '$http',
            'Restangular',
            function ($q, $http, Restangular) {
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
})();

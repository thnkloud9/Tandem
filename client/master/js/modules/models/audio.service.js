(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Audio', [
            '$q',
            '$http',
            'Restangular',
            function ($q, $http, Restangular) {
              var Audio = Restangular.all('audio');

              // extend collection 
              Restangular.extendCollection('audio', function(collection) {
                return collection;
              });

              // extend model
              Restangular.extendModel('audio', function(model) {
                return model;
              });

              return Audio;
            }
        
        ]);
})();

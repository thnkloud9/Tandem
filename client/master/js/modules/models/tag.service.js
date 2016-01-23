(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Tag', [
            '$q',
            '$http',
            'Restangular',
            'APP_CONFIG',
            function ($q, $http, Restangular, APP_CONFIG) {
              var Tag = Restangular.all('tags');
             
              // extend collection 
              Restangular.extendCollection('tags', function(collection) {

                collection.add = function(tagData){
                  if (typeof tagData.save === 'function') {
                     var tag = tagData;
                   } else {
                     var tag = Restangular.restangularizeElement(this.parentResource, buildData, 'tags');
                   }
                   this.push(tag);
                };

                return collection;
              });

              // extend model
              Restangular.extendModel('tags', function(model) {

                // TODO: add getQuestions() function?
               

                model.updateImage = function (file) {
                  var deferedPost = $q.defer();
                  var request = {
                    method: 'PATCH',
                    url: APP_CONFIG.API.full + '/tags/' + model._id,
                    headers: {
                      'If-Match': model._etag,
                      'Content-Type': undefined
                    },
                    transformRequest: function(data) { 
                      var payload = new FormData();
                      payload.append('image', file);
                      return payload; 
                    },
                    data: {
                      image: file
                    }
                  };

                  $http(request)
                  .then(function (response) {
                    var resourceId = response.data._id;
                    var request = {
                      method: 'GET',
                      url: APP_CONFIG.API.full + '/tags/'+resourceId,
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    };
                    return $http(request);  // retrieve update tags
                  }, $q.reject)
                  .then(function (response) {
                    Tag.get(response.data._id).then(function (tag) {
                      deferedPost.resolve(tag);
                    });
                  }, function (response) {
                    deferedPost.reject(response);
                  });

                  return deferedPost.promise;
                };

                return model;

              }); 
              return Tag;
            }
    
        ]);
})();

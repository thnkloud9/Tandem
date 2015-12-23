
'use strict';

/**
* A factory which creates a tag model.
*
* @class Topic
*/
angular.module('tandemWebApp')
  .factory('Tag', [
    '$q',
    'Restangular',
    'config',
    'session',
    function ($q, Restangular, config, session) {
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
        return model;

      }); 
      return Tag;
    }
]);

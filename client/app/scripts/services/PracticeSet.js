'use strict';

/**
* A factory which creates a practiceSet model.
*
* @class Topic
*/
angular.module('tandemWebApp')
  .factory('PracticeSet', [
    '$q',
    'Restangular',
    'config',
    'session',
    function ($q, Restangular, config, session) {
      var PracticeSet = Restangular.all('practice_sets');

      // extend collection 
      Restangular.extendCollection('practice_sets', function(collection) {

        collection.add = function(practiceSetData){
          if (typeof practiceSetData.save === 'function') {
             var practiceSet = practiceSetData;
           } else {
             var practiceSet = Restangular.restangularizeElement(this.parentResource, buildData, 'practice_sets');
           }
           this.push(practiceSet);
        };
        return collection;
      });

      // extend model
      Restangular.extendModel('practice_sets', function(model) {

        model.clearQuestions = function () {
          model.questions = [];
          model.update(model);
        };

        return model;
      });

      return PracticeSet;
    }
]);

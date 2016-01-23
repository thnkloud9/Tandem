(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('PracticeSet', [
            '$q',
            'Restangular',
            function ($q, Restangular) {
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
                
                model.hydrateQuestions = function () {
                  var deferedGet = $q.defer();
                  var loadedQuestions = [];
                  var questionIds = [];

                  if (model.questions) {
                    model.questions.forEach(function (question) {
                      // this question has already been loaded
                      if (question.restangularized) {
                          loadedQuestions.push(question);
                          questionIds.push(question._id);
                          if (loadedQuestions.length === model.questions.length) {
                            model.questions = loadedQuestions;
                            model.questionIds = questionIds;
                            deferedGet.resolve(loadedQuestions);
                          }
                      } else {
                        // load it from the server and restangularize it
                        Restangular.one('questions', question).get().then(function (loadedQuestion) {
                          loadedQuestions.push(loadedQuestion);
                          questionIds.push(loadedQuestion._id);
                          if (loadedQuestions.length === model.questions.length) {
                            model.questions = loadedQuestions;
                            model.questionIds = questionIds;
                            deferedGet.resolve(loadedQuestions);
                          }
                        });
                      }
                    });
                  } else {
                    model.questions = [];
                    model.questionIds = [];
                    deferedGet.resolve([]);
                  }          

                  return deferedGet.promise;
                };

                model.clearQuestions = function () {
                  model.questions = [];
                  model.update(model);
                };

                return model;
              });

              return PracticeSet;
            }

        ]);
})();

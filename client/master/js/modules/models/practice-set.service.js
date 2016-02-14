(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('PracticeSet', [
            '$q',
            '$rootScope',
            'Restangular',
            'APP_CONFIG',
            function ($q, $rootScope, Restangular, APP_CONFIG) {
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

              PracticeSet.newEmptySet = function () {
                var description = {};
                description[$rootScope.session.speaks] = '';
                description[$rootScope.session.learning] = '';
                var newSet = {
                  title: '',
                  score: 0,
                  played: 0,
                  description: {
                    languages: APP_CONFIG.languages.length,
                    original_language: $rootScope.session.speaks,
                    translations: description
                  },
                  submitted_by: $rootScope.session.userId,
                  category: ''
                };

                return newSet;
              };

              // used during live tandem session by topics
              // takes the entre questions list from am
              // array of questions
              PracticeSet.buildFromQuestions = function (title, questions, total) {
                var deferedPost = $q.defer();
                var tags = _.countBy(questions, "tags");
                var selectedQuestions = _.sample(questions, total);
                var newSet = PracticeSet.newEmptySet();
                
                newSet.title = title;
                newSet.category = 'tandem';
                // TODO: make sure at least 1 question from every distinct tag
                // gets added to the set?
                newSet.questions = _.pluck(selectedQuestions, '_id');

                // save the new practiceSet
                PracticeSet.post(newSet).then(function (practiceSet) {
                  // re-hydrate fields because POST will not include
                  // them
                  _.extend(practiceSet, newSet);
                  practiceSet.questions = selectedQuestions;
                  deferedPost.resolve(practiceSet);
                }, function (response) {
                  deferedPost.reject(response);
                });

                return deferedPost.promise;
              };

              return PracticeSet;
            }

        ]);
})();

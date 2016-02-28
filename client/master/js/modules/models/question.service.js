(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Question', [
            '$q',
            '$window',
            'Restangular',
            'Recording',
            'PracticeSet',
            'APP_CONFIG',
            function (
              $q,
              $window,
              Restangular,
              Recording,
              PracticeSet,
              APP_CONFIG) {
              var Question = Restangular.all('questions');
             
              // extend collection 
              Restangular.extendCollection('questions', function(collection) {

                collection.add = function(questionData){
                  if (typeof questionData.save === 'function') {
                     var question = questionData;
                   } else {
                     var question = Restangular.restangularizeElement(this.parentResource, buildData, 'questions');
                   }
                   this.push(question);
                };

                return collection;
              });

              // extend model
              Restangular.extendModel('questions', function(model) {

                /**
                 * loads audio meta data for question model
                 *   hasQuestionRecording 
                 *    - total number of question audio files, grouped by language
                 *   hasAnswerRecording 
                 *    - total number of answer audio files, grouped by language
                 *   currentRecordingIndex 
                 *    - current index of audio file grouped by language
                 */
                model.loadRecordingIndex = function () {
                  var deferedGet = $q.defer();
                  var projection = {
                    _id: 1,
                    status: 1,
                    submitted_by: 1,
                    context: 1,
                    language_code: 1,
                    _created: 1
                  };
                  var filter = {
                    "question": model._id,
                  };
                  var params = {
                    "where": filter,
                    "projection": projection
                  };
                  var submittedBy = $window.sessionStorage.getItem('user_id');

                  Recording.getList(params).then(function (audioIndex) {
                    model.totalQuestionRecording = {};
                    model.totalAnswerRecording = {};
                    model.hasQuestionRecording = {};
                    model.hasAnswerRecording = {};

                    APP_CONFIG.languages.forEach(function (language) {
                      model.totalQuestionRecording[language.code] = 0;
                      model.totalAnswerRecording[language.code] = 0;
                    });

                    audioIndex.forEach(function (audio) {
                      if (audio.context === 'question') {
                        model.totalQuestionRecording[audio.language_code]++;
                        if (audio.submitted_by === submittedBy) {
                          model.hasUserRecording = true;
                        }
                      }
                      if (audio.context === 'answer') {
                        model.totalAnswerRecording[audio.language_code]++;
                      }
                    });
                    model.audioIndex = audioIndex;

                    APP_CONFIG.languages.forEach(function (language) {
                      model.hasQuestionRecording[language.code] = (model.totalQuestionRecording[language.code] > 0);
                      model.hasAnswerRecording[language.code] = (model.totalAnswerRecording[language.code] > 0);
                    });

                    model.currentRecordingIndex = {};
                    APP_CONFIG.languages.forEach(function (language) {
                      model.currentRecordingIndex[language.code] = 0;
                    });
                    
                    model.currentRecording = null;

                    deferedGet.resolve(audioIndex);
                  });

                  return deferedGet.promise;
                };

                /**
                 * Return promise of audio blob url
                 *
                 * index - can be int, 'next, 'previous', or 'random'
                 *         correlates to audio in currentRecordingIndex
                 */
                model.getRecordingUrl = function(language, index) {
                  var params;
                  var num = model.currentRecordingIndex[language];
                  var max = (model.totalQuestionRecording[language] - 1);
                  var deferedGet = $q.defer();
                  var url = null;
                  var filter = {
                    "question": model._id,
                    "language_code": language,
                    "context": "question"
                  }
                  var embed = {
                    "submitted_by": 1
                  }

                  if (index) {
                    if (!isNaN(index)) {
                      num = index;
                    } else {
                      if (index === 'next') {
                        num = (model.currentRecordingIndex[language] + 1);
                        if (num > max) {
                          deferedGet.reject();
                          return deferedGet.promise;
                        }
                      } else if (index === 'previous') {
                        num = (model.currentRecordingIndex[language] - 1);
                        if (num < 0) {
                          deferedGet.reject();
                          return deferedGet.promise;
                        }
                      } else if (index === 'random') {
                        num = Math.floor(Math.random() * (max - 1 + 1)) + 1;
                        num = num - 1;
                        if ((num < 0) || (num > max)) {
                          deferedGet.reject();
                          return deferedGet.promise;
                        }
                      } else {
                        deferedGet.reject();
                        return deferedGet.promise;
                      }
                      model.currentRecordingIndex[language] = num;
                    }
                  }

                  // using num here to get a random results from mongo
                  params = {
                    "where": filter,
                    "embedded": embed,
                    "max_results": 1,
                    "page": (num + 1)
                  }

                  Recording.getList(params).then(function (audio) {
                    // load audio into audio player
                    var firstRecording = audio[0];
                    var blob = firstRecording.createBlob();
                    var url = URL.createObjectURL(blob);
                    model.currentRecording = firstRecording;
                    deferedGet.resolve(url); 
                  }, function (response) {
                    deferedGet.reject(response);
                  });

                  return deferedGet.promise;
                };

                model.addToPracticeSet = function(practiceSet) {
                  practiceSet.questions.push(model._id);
                  PracticeSet.one(practiceSet._id).patch(practiceSet);
                };

                model.removeFromPracticeSet = function(practiceSet) {
                  practiceSet.questions = _.without(practiceSet.questions, model._id);
                  PracticeSet.one(practiceSet._id).patch(practiceSet);
                };

                return model;

              }); 

              /**
               * search all text based fields in all languages
               * takes json mongo filter as optional additional
               * filter
               * return promise
               */
              Question.searchByText = function (text, filter, params) {
                var deferedGet = $q.defer();
                var speaksFilter = {};
                var learningFilter = {};
                // can't use session here due to circular dependency
                var speaks = $window.sessionStorage.getItem('speaks');
                var learning = $window.sessionStorage.getItem('learning');
                var params = (params) ? params : {};

                // TODO: dont think we need this anymore
                var tagsFilter = {
                  "tags_index": {
                    "$regex": ".*" + text + ".*",
                    "$options": "i"
                  }
                };
                speaksFilter['text.translations.' + speaks] = {
                  "$regex": ".*" + text + ".*",
                  "$options": "i"
                };
                learningFilter['text.translations.' + learning] = {
                  "$regex": ".*" + text + ".*",
                  "$options": "i"
                };

                if (filter) {
                  var finalFilter = {
                    "$and": [
                      filter,
                      { "$or": [ speaksFilter, learningFilter, tagsFilter ] }
                    ]
                  };
                } else {
                  var finalFilter = { "$or": [ speaksFilter, learningFilter, tagsFilter ] };
                }
                params.where = JSON.stringify(finalFilter);
                // get questions
                Question.getList(params).then(function (questions) {
                  deferedGet.resolve({ params: params, questions: questions });
                }, function (response) {
                  deferedGet.reject(response);
                });
                
                return deferedGet.promise;
              };

              Question.searchByTag = function (tagIds, filter, params) {
                var deferedGet = $q.defer();
                var params = (params) ? params : {};

                if (filter) {
                  var finalFilter = {
                    "$and": [
                      filter,
                      { "tags": { "$in" : tagIds } }
                    ]
                  };
                } else {
                  var finalFilter = { "tags": { "$in" : tagIds } };
                }
                params.where = JSON.stringify(finalFilter);

                // get questions
                Question.getList(params).then(function (questions) {
                  deferedGet.resolve(questions);
                }, function (response) {
                  deferedGet.reject(response);
                });
                
                return deferedGet.promise;
              };

              return Question;
            }
        
        ]);
})();

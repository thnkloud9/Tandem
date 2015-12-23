
'use strict';

/**
* A factory which creates a question model.
*
* @class Topic
*/
angular.module('tandemWebApp')
  .factory('Question', [
    '$q',
    'Restangular',
    'Recording',
    'PracticeSet',
    'config',
    'session',
    function ($q, Restangular, Recording, PracticeSet, config, session) {
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

          Recording.getList(params).then(function (audioIndex) {
            model.totalQuestionRecording = {};
            model.totalAnswerRecording = {};
            model.hasQuestionRecording = {};
            model.hasAnswerRecording = {};

            config.languages.forEach(function (language) {
              model.totalQuestionRecording[language.code] = 0;
              model.totalAnswerRecording[language.code] = 0;
            });

            audioIndex.forEach(function (audio) {
              if (audio.context === 'question') {
                model.totalQuestionRecording[audio.language_code]++;
                if (audio.submitted_by === session.userId) {
                  model.hasUserRecording = true;
                }
              }
              if (audio.context === 'answer') {
                model.totalAnswerRecording[audio.language_code]++;
              }
            });
            model.audioIndex = audioIndex;

            config.languages.forEach(function (language) {
              model.hasQuestionRecording[language.code] = (model.totalQuestionRecording[language.code] > 0);
              model.hasAnswerRecording[language.code] = (model.totalAnswerRecording[language.code] > 0);
            });

            model.currentRecordingIndex = {};
            config.languages.forEach(function (language) {
              model.currentRecordingIndex[language.code] = 0;
            });
            
            model.currentRecording = null;

            deferedGet.resolve(audioIndex);
          });

          return deferedGet.promise;
        };

        model.flipCard = function() {
          model.flipped = !model.flipped;
          model.cardClass = (model.flipped) ? 'flipped' : null;
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
      return Question;
    }
]);

'use strict';

/**
* A factory which creates a question model.
*
* @class Topic
*/
angular.module('tandemWebApp')
  .factory('Recording', [
    '$q',
    '$http',
    'Restangular',
    'toaster',
    'config',
    'session',
    function ($q, $http, Restangular, toaster, config, session) {
      var Recording = Restangular.all('audio');

      //audio.file = (data.file) ? data.file : Recording.audioFileBlob(data.audio);
      // extend collection 
      Restangular.extendCollection('audio', function(collection) {
        return collection;
      });

      // extend model
      Restangular.extendModel('audio', function(model) {

        /**
        * Takes base64 string and converts it to 
        * and audio/mp3 blob
        */
        model.createBlob  = function () {
          if (!model.audio) {
            return false;
          }
          var contentType = 'audio/mp3';
          var sliceSize = 512;
          var data = model.audio.replace(/\s/g, '');
          var byteCharacters = atob(data);
          var byteArrays = [];

          for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
          }

          var blob = new Blob(byteArrays, {type: contentType});
          model.blob = blob;
          
          return blob;
        };

        return model;
      });

      /**
       * Not sure if we can do this with Restangular
       * so leaving this here for now
       */
      Recording.create = function(blob, context, language, question) {
        var deferedPost = $q.defer();
        var questionId = question._id
        var questionText = question.text.translations[language];
        var request = {
          method: 'POST',
          url: config.API.full + '/audio',
          headers: {'Content-Type': undefined},
          transformRequest: function(data) { 
            var payload = new FormData();
            payload.append('audio', data.blob, 'audio.mp3');
            payload.append('context', data.context);
            payload.append('language_code', data.language_code);
            payload.append('question_text', questionText);
            payload.append('status', data.status);
            payload.append('question', data.question);
            payload.append('submitted_by', data.submitted_by);
            return payload; 
          },
          data: {
            blob: blob,
            context: context,
            language_code: language,
            status: 'submitted',
            question: questionId,
            submitted_by: session.userId
          }
        }

        $http(request)
        .then(function (response) {
          var resourceId = response.data._id;
          var embedString = '?embedded={"question": 1, "submitted_by": 1}';
          var request = {
            method: 'GET',
            url: config.API.full + '/audio/'+resourceId + embedString,
            headers: {
              'Content-Type': 'application/json'
            }
          };
          return $http(request);  // retrieve created audio
        }, $q.reject)
        .then(function (response) {
          var audio = response.data;
          deferedPost.resolve(audio);
        }, function () {
          toaster.pop('error', "Server Problem", "There was a server problem.  Please try again in a few moments.");
          deferedPost.reject();
        });

        return deferedPost.promise;
      };
  
      return Recording;
    }
]);

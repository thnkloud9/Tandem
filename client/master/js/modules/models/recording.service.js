(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Recording', [
            '$q',
            '$http',
            '$window',
            'Restangular',
            'APP_CONFIG',
            function ($q, $http, $window, Restangular, APP_CONFIG) {
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
                var submittedBy = $window.sessionStorage.getItem('user_id');
                var request = {
                  method: 'POST',
                  url: APP_CONFIG.API.full + '/audio',
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
                    submitted_by: submittedBy 
                  }
                }

                $http(request)
                .then(function (response) {
                  var resourceId = response.data._id;
                  var embedString = '?embedded={"question": 1, "submitted_by": 1}';
                  var request = {
                    method: 'GET',
                    url: APP_CONFIG.API.full + '/audio/'+resourceId + embedString,
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  };
                  return $http(request);  // retrieve created audio
                }, $q.reject)
                .then(function (response) {
                  var audio = response.data;
                  deferedPost.resolve(audio);
                }, function (response) {
                  deferedPost.reject(response);
                });

                return deferedPost.promise;
              };
          
              return Recording;
            }

        ]);
})();

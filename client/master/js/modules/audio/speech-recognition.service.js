'use strict';

/* audio recorder service. */
angular.module('app.audio').service('speechRecognition', [ 
  '$rootScope', 
  function speechRecognition($rootScope) {
    var self = this;

    self.recognition = null;
    self.recognizing = false;
    self.results = null;

    self.init = function (language) {
      self.reset();
      if ('webkitSpeechRecognition' in window) {
        self.recognition = new webkitSpeechRecognition();
        self.recognition.lang = self.getLanguage(language);
        self.recognition.continuous = true;
        self.recognition.interimResults = true;
        self.recognition.onerror = self.onError;
        self.recognition.onend = self.reset;
        self.recognition.onresult = self.onResult;
        return self.recognition.onstart = self.onStart;
      } else {
        self.recognition = {};
        console.log('webkitSpeechRecognition not supported');
      }
    };

    self.start = function () {
      self.recognition.start();
    };

    self.stop = function () {
      self.recognition.stop();
    };

    self.onResult = function (event) {
      var i, result, resultIndex, trans, _results
      resultIndex = event.resultIndex;
      trans = '';
      i = resultIndex;
      _results = [];
      while (i < event.results.length) {
        result = event.results[i][0];
        $rootScope.$emit('speech-detected-word', result.transcript);
        trans = self.capitalize(result.transcript);
        self.results = trans;
        if (event.results[i].isFinal) {
           return trans;
        }
        _results.push(++i);
      }
      return _results;
    };

    self.capitalize = function (string) {
      var first_char = /\S/;
      return string.replace(first_char, function(firstChar) {
        return firstChar.toUpperCase();
      });
    };

    self.reset = function (event) {
      self.recognizing = false;
    };

    self.onStart = function (event) {
      console.log('started speech detection.');
    };

    self.onError = function (event, message) {
      console.log('web speech error: ' + message);
    };
    
    self.getLanguage = function (languageCode) {
      if (languageCode === 'de') {
        return 'de-DE';
      };
      if (languageCode === 'en') {
        return 'en-US';
      };
      if (languageCode === 'en') {
        return 'es-ES';
      };
    };
  }
]);

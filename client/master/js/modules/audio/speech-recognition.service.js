'use strict';

/* audio recorder service. */
angular.module('app.audio').service('speechRecognition', [ 
  '$rootScope', 
  function speechRecognition($rootScope) {
    var self = this;

    self.recognition = null;
    self.recognizing = false;
    self.results = null;
    self.status = null;

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
        self.status = 'initiiated';
        return self.recognition.onstart = self.onStart;
      } else {
        self.recognition = {};
        console.log('webkitSpeechRecognition not supported');
      }
    };

    // This is better for answer checking as it will wait
    // for pauses to send a speech string.  As far as I
    // could tell this mustbe done at init time, hence
    // the separate init funtion
    self.answerInit = function (language) {
      self.reset();
      if ('webkitSpeechRecognition' in window) {
        self.recognition = new webkitSpeechRecognition();
        self.recognition.lang = self.getLanguage(language);
        self.recognition.continuous = true;
        self.recognition.interimResults = false;
        self.recognition.onerror = self.onError;
        self.recognition.onend = self.reset;
        self.recognition.onresult = self.onResult;
        self.status = 'initiiated';
        return self.recognition.onstart = self.onStart;
      } else {
        self.recognition = {};
        console.log('webkitSpeechRecognition not supported');
      }
    };

    // stop recognition when we change routes
    // because we can't do it with a controller
    // close function
    $rootScope.$on('$stateChangeSuccess', function(event) {
      self.stop();
    });

    self.start = function () {
      if (self.status !== 'started') {
        self.recognition.start();
        self.status = 'started';
      }
    };

    self.stop = function () {
      if (self.status === 'started') {
        self.recognition.stop();
      }
      self.status = 'stopped';
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

    self.onStop = function (event) {
      console.log('stopped speech detection.');
    };

    self.onError = function (event, message) {
      console.log('web speech recognition error: ' + message);
      self.stop();
      if ($rootScope.app.audio.speechRecognition) {
        self.start();
      }
    };
    
    self.getLanguage = function (languageCode) {
      if (languageCode === 'de') {
        return 'de-DE';
      };
      if (languageCode === 'en') {
        return 'en-US';
      };
      if (languageCode === 'es') {
        return 'es-ES';
      };
    };
  }
]);

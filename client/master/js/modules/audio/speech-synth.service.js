'use strict';

/* audio recorder service. */
angular.module('app.audio').service('speechSynth', [ 
  '$rootScope', 
  function speechSynth($rootScope) {
    var self = this;

    self.text = null;
    self.status = null;
    self.supported = false;

    self.checkSupport = function () {
      if ('speechSynthesis' in window) {
        self.supported = true;
        console.log('speechSynthesis supported');
        return true;
      } else {
        self.supported = false;
        console.log('speechSynthesis not supported');
        return false;
      }
    };

    self.speak = function (text, languageCode) {
      self.text = text;
      var msg = new SpeechSynthesisUtterance();
      msg.text = text;
      msg.lang = self.getVoice(languageCode)
      window.speechSynthesis.speak(msg);
    };

    self.getVoice = function (languageCode) {
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

'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:ModalTutorCtrl
 * @description
 * # ModalTutorCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('ModalTutorCtrl', [
  '$rootScope',
  '$q',
  '$aside',
  'config',
  'User',
  'Question',
  'Tag',
  'speechRecognition',
  'session',
  function ($rootScope, $q, $aside, config, User, Question, Tag, speechRecognition, session) {
    var self = this;

    self.tags = [];
    self.availableTags = [];
    Tag.getList().then(function (tags) {
      angular.forEach(tags, function (tag) {
        self.availableTags.push(tag.text.translations[session.speaks]);
        self.availableTags.push(tag.text.translations[session.learning]);
        console.log(
            'available topics',
            tag.text.translations[session.speaks],
            tag.text.translations[session.learning]
        );
      });
    });

    // init speech recognition engine
    // and watch results for display
    speechRecognition.init(session.speaks);

    $rootScope.$on('speech-detected-word', function(event, word) {
      self.speechRecognitionResults = word;

      if (self.availableTags.indexOf(word.trim()) > -1) {
        if (self.tags.indexOf(word.trim()) < 0) {
          self.tags.push(word.trim());
        }
      }
      $rootScope.$apply();
    });

    self.toggleSpeechDetection = function () {
      self.speechDetection = !self.speechDetection;
      self.showTranscription = !self.showTranscription;
      if (self.speechDetection) {
        self.speechRecognitionResults = '...listening';
        speechRecognition.start();
      }
      if (!self.speechDetection) {
        speechRecognition.stop();
      }
    };

    self.buildPracticeSet = function () {
      var tagFilters = [];
      angular.forEach(self.tags, function (tag) {
        var filter = {
          "tags": {
            "$regex": ".*" + tag + ".*",
            "$options": "i"
          }
        }
        tagFilters.push(filter);
      });
      var params = {
        "where": {
          "$or": tagFilters
        },
        "sort": "-created"
      }
      Question.getList(params).then(function (questions) {
        console.log(questions);
      });
    };

    self.showHelp = function () {
      var asideInstance = $aside.open({
        templateUrl: 'views/aside-tutor-help.html',
        placement: 'left',
        size: 'sm'
      });
    };
  }
]);
   

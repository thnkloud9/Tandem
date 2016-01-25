(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name tandemWebApp.controller:AddQuestionAudioModalController
     * @description
     * # ModalAddQuestionCtrl
     * Controller of the tandemWebApp
     */
    angular.module('app.questions').controller('AddQuestionAudioModalController', [
      '$q',
      '$scope',
      'APP_CONFIG',
      'Recording',
      'PracticeSet',
      'session',
      'recordingQuestion',
       function AddQuestionAudioModalController(
        $q,
        $scope,
        APP_CONFIG,
        Recording,
        PracticeSet,
        session,
        recordingQuestion) {
        var self = this;

        self.recordingQuestion = session.recordingQuestion;

        self.learningTabActive = true;
        self.speaksTabActive = false;
        self.practiceSetTabActive = false;
        self.hasSpeaksRecording = false;
        self.hasLearningRecording = false;

        // reset for new question
        var params = {
          "where": {
            "submitted_by": session.userId
           },
           "sort": "_created"
        };
        PracticeSet.getList(params).then(function (practiceSets) {
          self.practiceSets = practiceSets;
        });
        self.recordingQuestion = recordingQuestion;

        // check for audio already
        params = {
          "where": {
            "submitted_by": session.userId,
            "question": self.recordingQuestion._id,
            "context": "question"
          }
        }
        Recording.getList(params).then(function (audios) {
          audios.forEach(function (audio) {
            if (audio.language_code === session.speaks) {
              self.hasSpeaksRecording = true;
              self.speaksTabActive = false;
              self.learningTabActive = true;
              self.speaksRecordingUrl = APP_CONFIG.API.rootURI + '/assets/audio/' + audio._id;
              self.speaksRecording = audio;
            }
            if (audio.language_code === session.learning) {
              self.hasLearningRecording = true;
              self.learningTabActive = false;
              self.speaksTabActive = true;
              self.learningRecordingUrl = APP_CONFIG.API.rootURI + '/assets/audio/' + audio._id;
              self.learningRecording = audio;
            }
            if ((self.hasLearningRecording) && (self.hasSpeaksRecording)) {
              self.practiceSetTabActive = true;
            }
          });
        });

        self.addToPracticeSet = function (practiceSet) {
          if (!practiceSet.questions) {
            practiceSet.questions = [];
          }
          self.recordingQuestion.addToPracticeSet(practiceSet);
          _.remove(self.practiceSets, {_id: practiceSet._id});
        };

        self.learningSaved = function () {
          self.learningTabActive = false;
          self.hasLearningRecording = true;
          self.speaksTabActive = true;
          // add user points
        };

        self.speaksSaved = function () {
          self.speaksTabActive = false;
          self.hasSpeaksRecording = true;
          self.practiceSetTabActive = true;
          // add user points
        };

      }
    ]);
})();

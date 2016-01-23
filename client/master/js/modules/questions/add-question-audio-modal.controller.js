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

        self.currentUser = session.user;
        self.speaksCode = session.speaks;
        self.learningCode = session.learning;
        self.speaksText = session.speaksText; 
        self.learningText = session.learningText;
        self.recordingQuestion = session.recordingQuestion;

        self.practiceSetTabDisabled = true;
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
            if (audio.language_code === self.speaksCode) {
              self.hasSpeaksRecording = true;
              self.speaksRecordingUrl = APP_CONFIG.API.rootURI + '/assets/audio/' + audio._id;
              self.speaksRecording = audio;
            }
            if (audio.language_code === self.learningCode) {
              self.hasLearningRecording = true;
              self.learningRecordingUrl = APP_CONFIG.API.rootURI + '/assets/audio/' + audio._id;
              self.learningRecording = audio;
            }
          });

          if ((self.hasLearningRecording) && (self.hasSpeaksRecording)) {
            self.practiceSetTabDisabled = false;
            self.practiceSetTabActive = true;
          } else {
            self.learningTabActive = false;
            setTimeout(function () {
              self.learningTabActive = true;
            }, 500);
          }

        });

        self.addToPracticeSet = function (practiceSet) {
          if (!practiceSet.questions) {
            practiceSet.questions = [];
          }
          self.recordingQuestion.addToPracticeSet(practiceSet);
          _.remove(self.practiceSets, {_id: practiceSet._id});
        };

        self.learningSaved = function () {
          self.speaksTabActive = true;
          self.hasLearningRecording = true;
          // add user points
        };

        self.speaksSaved = function () {
          self.practiceSetTabDisabled = false;
          self.practiceSetTabActive = true;
          self.hasSpeaksRecording = true;
          // add user points
        };

      }
    ]);
})();

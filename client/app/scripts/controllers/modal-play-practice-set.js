'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:ModalPlayPracticeSetctrl
 * @description
 * # ModalPlayPracticeSetctrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('ModalPlayPracticeSetCtrl', [
  '$scope',
  '$q',
  'config',
  'Recording',
  'PracticeSet',
  'PracticeSession',
  'Activity',
  'session',
  'speechRecognition',
   function (
    $scope, 
    $q,
    config, 
    Recording, 
    PracticeSet, 
    PracticeSession, 
    Activity,
    session,
    speechRecognition) {
    var self = this;
 
    self.speaksCode = session.speaks;
    self.learningCode = session.learning;
    self.speaksText = session.speaksText; 
    self.learningText = session.learningText;
    self.speechDetection = false;
    self.showRecorder = false;
    self.showPlayer = true;

    // init speech recognition engine
    // and watch results for display
    speechRecognition.init(self.learningCode);
    $scope.$watch(angular.bind(speechRecognition, function () {
      return speechRecognition.results;
    }), function (newVal, oldVal) {
      self.speechRecognitionResults = newVal;
    });

    self.playingPracticeSet = session.playingPracticeSet;
    $scope.$watch(angular.bind(session, function () {
      return session.playingPracticeSet;
    }), function (newVal, oldVal) {
      self.initPracticeSession(newVal);
    });

    // check if there is an existing practice_session for
    // this practice_set that is still in started states
    self.initPracticeSession = function (practiceSet) {
      self.playedQuestions = [];
      self.completed = false;
      self.showQuestions = false;
      self.audioUrl = null;
      self.recordingQuestion = null;

      // now load the first question
      PracticeSession.initFromPracticeSet(practiceSet).then(function (practiceSession) {
        practiceSession.initQuestions().then(function () {
          self.practiceSession = practiceSession;
          self.initQuestion();
        });
      });
    };

    // loads random question audio into 
    // audio player for playback
    self.initQuestion = function () {
      self.showPlayer = true;
      self.practiceSession.currentQuestion.getRecordingUrl(self.learningCode, 'random').then(function (url) {
        self.audioUrl = url;
        self.playedQuestions.push(self.practiceSession.currentQuestion);
      });
    };

    self.toggleSpeechDetection = function () {
      self.speechDetection = !self.speechDetection;
      self.showTranscription = !self.showTranscription;
      if (self.speechDetection) {
        speechRecognition.results = '...listening';
        speechRecognition.start();
      }
      if (!self.speechDetection) {
        speechRecognition.stop();
      }
    };

    self.playerFinished = function () {
      self.showRecorder = true;
    };

    self.recordingStarted = function () {
      self.recordingQuestion = self.practiceSession.currentQuestion;
      //self.showPlayer = false;
    };

    self.audioSaved = function (newRecording) {
      self.showRecorder = false;

      // push question audio into practiceSession
      // and save the practice session
      self.practiceSession.answers.push(self.practiceSession.currentQuestion._id);
      self.practiceSession.audio.push(self.practiceSession.currentQuestion.currentRecording._id);
      self.practiceSession.audio.push(newRecording._id);
      PracticeSession.one(self.practiceSession._id).patch({
        answers: self.practiceSession.answers,
        audio: self.practiceSession.audio,
      });

      // and make question audio the parent of the answer audio
      Recording.one(newRecording._id).patch({
        "parent_audio": self.practiceSession.currentQuestion.currentRecording._id,
        "affected_user": self.practiceSession.currentQuestion.currentRecording.submitted_by
      });

      // load next question or show complete
      if (self.practiceSession.lastQuestion) {
        self.showComplete = true;
      } else {
        self.practiceSession.loadNextQuestion().then(function () {
          self.initQuestion();
        });
      }
    };

    self.savePracticeSession = function () {
      self.practiceSession.status = 'completed';
      PracticeSession.one(self.practiceSession._id).patch({
        status: self.practiceSession.status
      });
      self.logActivity(); 
    };

    self.logActivity = function () {
      // save user activity
      var activityData = {
        "action": "completed",
        "context": "practice_session",
        "language": self.learningCode,
        "affected_object": self.practiceSession._id,
        "submitted_by": session.userId
      }
      Activity.post(activityData);
    }
   
  }
]);

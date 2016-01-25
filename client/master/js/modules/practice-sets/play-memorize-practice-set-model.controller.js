(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name tandemWebApp.controller:ModalPlayPracticeSetctrl
     * @description
     * # ModalPlayPracticeSetctrl
     * Controller of the tandemWebApp
     */
    angular.module('app.practiceSets').controller('PlayMemorizePracticeSetModalController', [
      '$rootScope',
      '$scope',
      'ngAudio',
      'APP_CONFIG',
      'PracticeSet',
      'PracticeSession',
      'Activity',
      'session',
      'playingSet',
      'recorder',
      'speechRecognition',
       function (
        $rootScope,
        $scope, 
        ngAudio,
        APP_CONFIG, 
        PracticeSet, 
        PracticeSession, 
        Activity,
        session,
        playingSet,
        recorder,
        speechRecognition) {
        var self = this;
     
        self.score = 0;
        self.failCatch = null;

        // init speech recognition engine
        // and watch results for display
        // TODO:  IMPORTANT!!!!!!!!!!!!!!
        // it seems that this watch does not work unless 
        // ngAudio is loaded before, even without a url.  No idea why.
        speechRecognition.init(session.speaks);
        if ($rootScope.app.audio.speechRecognition) {
          self.player = ngAudio.load('');
          speechRecognition.results = '...listening';
          speechRecognition.start();
        }
        $scope.$watch(angular.bind(speechRecognition, function () {
          return speechRecognition.results;
        }), function (newVal, oldVal) {
          console.log('got updated speech results');
          self.speechRecognitionResults = newVal;
          if ((self.correctAnswer) && (newVal !== '...listening')) {
            if (newVal.toLowerCase() === self.correctAnswer.toLowerCase()) {
              self.pass = true;
              self.fail = false;
              self.answer = self.correctAnswer;
              self.submitAnswer();
              clearTimeout(self.failCatch);
            } else {
              self.failCatch = setTimeout(function () {
                self.fail = true;
                self.pass = false;
              }, 5000);
            }
          }
        });

        // check if there is an existing practice_session for
        // this practice_set that is still in started states
        self.initPracticeSession = function (practiceSet) {
          self.playedQuestions = [];
          self.completed = false;
          self.showQuestions = false;
          self.audioUrl = null;
          self.recordingQuestion = null;
          self.score = (practiceSet.score) ? practiceSet.score : 0;

          // now loa first question
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
          self.playedQuestions.push(self.practiceSession.currentQuestion);
          self.correctAnswer = self.practiceSession.currentQuestion.text.translations[session.speaks];
          self.fail = false;
          self.pass = false;
          self.answer = '';
        };

        self.toggleSpeechRecognition = function () {
          $rootScope.app.audio.speechRecognition = !$rootScope.app.audio.speechRecognition;
          if ($rootScope.app.audio.speechRecognition) {
            speechRecognition.results = '...listening';
            speechRecognition.start();
          }
          if (!$rootScope.app.audio.speechRecognition) {
            speechRecognition.stop();
          }
        };

        self.submitAnswer = function () {

          if (self.answer === self.correctAnswer) {
            self.score += Math.floor(100 / self.practiceSession.questions.length);
          } else {
            self.fail = true;
          }

          // push question audio into practiceSession
          // and save the practice session
          self.practiceSession.answers.push(self.practiceSession.currentQuestion._id);
          PracticeSession.one(self.practiceSession._id).patch({
            answers: self.practiceSession.answers,
            score: self.score
          });

          self.loadNextQuestion();
        };

        self.loadNextQuestion = function () {
          // load next question or show complete
          if (self.practiceSession.lastQuestion) {
            self.showComplete = true;
            self.finishPracticeSession();
          } else {
            self.practiceSession.loadNextQuestion().then(function () {
              self.initQuestion();
            });
          }
        };

        self.finishPracticeSession = function () {
          self.practiceSession.status = 'completed';
          self.practiceSession.score = self.score;
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
            "language": session.learning,
            "affected_object": self.practiceSession._id,
            "submitted_by": session.userId
          }
          Activity.post(activityData);
        }

        self.initPracticeSession(playingSet);
       
      }
    ]);
})();


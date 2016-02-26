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
      '$timeout',
      'ngAudio',
      'APP_CONFIG',
      'PracticeSet',
      'PracticeSession',
      'Activity',
      'Notify',
      'session',
      'playingSet',
      'recorder',
      'speechRecognition',
       function (
        $rootScope,
        $scope,
        $timeout,
        ngAudio,
        APP_CONFIG, 
        PracticeSet, 
        PracticeSession, 
        Activity,
        Notify,
        session,
        playingSet,
        recorder,
        speechRecognition) {
        var self = this;
     
        self.score = 0;
        self.recognition = session.speaks;

        // init speech recognition engine
        // and watch results for display
        // TODO:  IMPORTANT!!!!!!!!!!!!!!
        // it seems that this watch does not work unless 
        // ngAudio is loaded before, even without a url.  No idea why.
        speechRecognition.answerInit(session.speaks);
        self.player = ngAudio.load('');
        if ($rootScope.app.audio.speechRecognition) {
          speechRecognition.results = '...listening';
          speechRecognition.start();
        }
        $scope.$watch(angular.bind(speechRecognition, function () {
          return speechRecognition.results;
        }), function (newVal, oldVal) {
          self.speechRecognitionResults = newVal;
          if ((self.correctAnswer) && (newVal !== '...listening')) {
              self.answer = newVal;
              self.submitAnswer();
          }
        });

        self.switchRecognition = function () {
          if ($rootScope.app.audio.speechRecognition) {
            speechRecognition.stop();
          }
          if (self.recognition === session.speaks) {
            console.log('switching to', session.learning);
            // set here just in case the user toggles
            // speech recognition on after the question has
            // been loaded
            speechRecognition.answerInit(session.learning);
            self.recognition = session.learning;
          } else {
            console.log('switching to', session.speaks);
            speechRecognition.answerInit(session.speaks);
            self.recognition = session.speaks;
          }
          if ($rootScope.app.audio.speechRecognition) {
            speechRecognition.start();
          } else {
            speechRecognition.stop();
          }
        }

        // check if there is an existing practice_session for
        // this practice_set that is still in started states
        self.initPracticeSession = function (practiceSet) {
          self.playedQuestions = [];
          self.completed = false;
          self.showQuestions = false;
          self.audioUrl = null;
          self.recordingQuestion = null;
          self.score = 0;

          // now loa first question
          PracticeSession.initFromPracticeSet(practiceSet).then(function (practiceSession) {
            practiceSession.initQuestions().then(function () {
              self.practiceSession = practiceSession;
              self.score = practiceSession.score;
              self.initQuestion();
            });
          }, function (response) {
            Notify.alert('Error trying play this PracticeSet', {status: 'danger'});
          });
        };

        // loads random language text from the current question
        self.initQuestion = function () {
          // randomize call to self.switchRecognition here
          // checks if random number between 1 and 10 is
          // even, if so swicth recognition
          if ((Math.floor((Math.random() * 10) + 1) % 2) == 0) {
            self.switchRecognition();
          }
          if (self.recognition === session.speaks) {
            self.currentQuestion = self.practiceSession.currentQuestion.text.translations[session.learning];
            self.correctAnswer = self.practiceSession.currentQuestion.text.translations[session.speaks];
          } else {
            self.currentQuestion = self.practiceSession.currentQuestion.text.translations[session.speaks];
            self.correctAnswer = self.practiceSession.currentQuestion.text.translations[session.learning];
          }
          // sanitize the correct answer
          self.correctAnswer = self.correctAnswer
            .trim()
            .toLowerCase()
            .replace('[-,_]', ' ')
            .replace(/[.\/#!$%\^&\*;:{}=\`~()]/g,"");
          self.playedQuestions.push(self.practiceSession.currentQuestion);
          self.fail = false;
          self.pass = false;
          self.answer = '';
          self.attempts = 0;
          self.hints = [];
        };

        // TODO: move this to a function of speechRecognition
        // service, maybe listen on rootScope?
        self.toggleSpeechRecognition = function () {
          $rootScope.app.audio.speechRecognition = !$rootScope.app.audio.speechRecognition;
          if ($rootScope.app.audio.speechRecognition) {
            speechRecognition.results = '...listening';
            if (speechRecognition.status !== 'started') {
              speechRecognition.start();
            }
          } else {
            speechRecognition.stop();
          }
        };

        self.submitAnswer = function () {
          // sanitize answer
          self.answer = self.answer
            .trim()
            .toLowerCase()
            .replace('[-,_]', ' ')
            .replace(/[.\/#!$%\^&\*;:{}=\`~()]/g,"");
          self.attempts++;
          // add score, ro add failures
          if (self.answer === self.correctAnswer) {
            self.pass = true;
            self.fail = false;
            self.score += Math.ceil(100 / self.practiceSession.questions.length);
            if (self.score > 100) {
              self.score = 100;
            }
            // push question audio into practiceSession
            // and save the practice session
            // TODO: not sure if we really need the answers here
            // but left it here for consistency sake
            self.practiceSession.answers.push(self.practiceSession.currentQuestion._id);
            PracticeSession.one(self.practiceSession._id).patch({
              answers: self.practiceSession.answers,
              score: self.score
            });
            self.loadNextQuestion();
          } else {
            self.fail = true;
            self.pass = false;
            // skip if more than 5 fails
            if (self.attempts > 5) {
              self.loadNextQuestion();
            }
          }
          // only show pass / fail messages for a second
          self.responseRefresh = $timeout(function () {
            self.fail = false;
            self.pass = false;
            console.log('refreshing reponse');
          }, 3000);
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
          speechRecognition.stop();
          self.practiceSession.status = 'completed';
          self.practiceSession.score = self.score;
          PracticeSession.one(self.practiceSession._id).patch({
            status: self.practiceSession.status
          });
          self.updatePracticeSet();
          self.logActivity(); 
        };

        self.updatePracticeSet = function () {
          var played = (playingSet.played) ? playingSet.played + 1 : 1;
          var practiceSetData = {
            score: self.practiceSession.score,
            played: played 
          };
          PracticeSet.one(playingSet._id).patch(practiceSetData).then(function() {
            Notify.alert("Your score has been updated.", {status: 'success'});
          }, function () {
            Notify.alert( "Server Problem.", {status: 'success'});
          });
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


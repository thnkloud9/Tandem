'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:ReviewCtrl
 * @description
 * # ReviewCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('ReviewCtrl', [
  '$q',
  '$modal',
  '$aside',
  'config',
  'Question',
  'Recording',
  'PracticeSession',
  'session',
   function ($q, $modal, $aside, config, Question, Recording, PracticeSession, session) {
    var self = this;

    self.isAdmin = (session.roles === "admin"); 
    //self.audios = Recording.getList();
    self.audios = [];
    self.speaksCode = session.speaks;
    self.learningCode = session.learning;
    self.speaksText = session.speaksText; 
    self.learningText = session.learningText;

    self.displayRecording = false;
    self.displayPracticeSessions = true;

    var params = {
      "where": {"status": "completed"},
      "embedded": {
        "practice_set": 1
      }
    };
    PracticeSession.getList(params).then(function (practiceSessions) {
      self.practiceSessions = practiceSessions;
    });

    self.test = function () {
      console.log(self.practiceSessions);
    };

    self.showRecording = function () {
      self.displayRecording = true;
      self.displayPracticeSessions = false;
      // init audio search
    }

    self.showPracticeSessions = function () {
      self.displayRecording = false;
      self.displayPracticeSessions = true;
      // init practiceSession search
    }

    self.showRecordingFilterModal = function () {
      $modal.open({
        controller: 'ReviewCtrl',
        controllerAs: 'reviewCtrl',
        templateUrl: 'views/modal-audio-filter.html'
      });
    };

    self.searchRecording = function () {
      var tagsFilter = {
        "tags": {
          "$regex": ".*" + self.searchText + ".*",
          "$options": "i"
        }
      };
      var questionFilter = {
        "question_text": {
          "$regex": ".*" + self.searchText + ".*",
          "$options": "i"
        }
      };
      var filter = {
        "$or": [
          tagsFilter,
          questionFilter
        ]
      };
      var params = {
        "where": JSON.stringify(filter)
      };
      self.recordings = Recording.getList(params).then(function (recording) {
        self.recordings = recording;
      });
    };

    self.searchPracticeSessions = function () {
    };

    self.openPracticeSessionModal = function (practiceSession) {
      session.reviewingPracticeSession = practiceSession;
      $modal.open({
        controller: 'ModalReviewPracticeSessionCtrl',
        controllerAs: 'modalReviewPracticeSessionCtrl',
        templateUrl: 'views/modal-review-practice-session.html'
      });
    };
    
    self.showHelp = function () {
      var asideInstance = $aside.open({
        templateUrl: 'views/aside-review-help.html',
        placement: 'left',
        size: 'sm'
      });
    };
  }
]);


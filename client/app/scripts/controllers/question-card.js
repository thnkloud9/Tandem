'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:QuestionCardCtrl
 * @description
 * # QuestionCardCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('QuestionCardCtrl', [
  '$scope',
  '$q',
  '$modal',
  '$aside',
  'toaster',
  'modalFactory',
  'config',
  'Question',
  'Tag',
  'session',
   function ($scope, $q, $modal, $aside, toaster, modalFactory, config, Question, Tag, session) {
    var self = this;
 
    // instantiate object
    if (typeof self.question === 'object') {
      if (typeof self.question.loadRecordingIndex === 'function') {
        self.question.loadRecordingIndex();
      }
    } else {
      var params = {
        "embedded": {
          "submitted_by": 1,
          "tags": 1
        }
      }

      Question.get(self.question, params).then(function (question) {
        question.loadRecordingIndex();
        self.question = question;
      });
    }
   
    self.isAdmin = (session.roles === "admin"); 
    self.speaksCode = session.speaks;
    self.learningCode = session.learning;
    self.speaksText = session.speaksText; 
    self.learningText = session.learningText;
    self.audioUrl = null;
    self.audioUser = null;
    self.hovering = false;
    self.currentLanguage = session.learning;

    Tag.getList().then(function (tags) {
      self.availableTags = tags;
    });

    self.onHover = function () {
      self.hovering = true;
    }
    self.onHoverEnd = function () {
      self.hovering = false;
    }

    self.removeQuestion = function (questionId) {
      var modal;
      var title = 'Do you really want to remove this Question?';
      var text = 'It will be removed from all practice sets, ' +
        'and all associated audio will also be removed.';

      modal = modalFactory.confirmLight(title, text);
      modal.result.then(function () {
        return Question.one(questionId).remove();
      }, $q.reject)
      .then(function () {
        toaster.pop('success', "Question Removed", "Question has been removed.");
      });
    };

    self.togglePreview = function (language) {
      self.question.showPreviewControls = !self.question.showPreviewControls;
      if (!self.player) {
        self.initPlayer(language);
      }
    };

    self.initPlayer = function (language) {
      var question = self.question;
      if (question.hasQuestionRecording[language]) {
        // load first audio src
        self.question.getRecordingUrl(language).then(function (url) {
          self.audioUrl = url;
          self.audioUser = question.currentRecording.submitted_by;
        });
      }
    };

    self.nextQuestionRecording = function (question) {
      self.playing = false;
      question.getRecordingUrl(self.currentLanguage, 'next').then(function (url) {
        self.audioUrl = url;
        self.audioUser = question.currentRecording.submitted_by;
      }); 
    };

    self.prevQuestionRecording = function (question) {
      self.playing = false;
      question.getRecordingUrl(self.currentLanguage, 'previous').then(function (url) {
        self.audioUrl = url;
        self.audioUser = question.currentRecording.submitted_by;
      }); 
    };
    
    self.flipCard = function () {
      var question = self.question;

      if (self.playing) {
        self.player.stop();
      }
      self.playing = false;
      question.flipCard();
      var language = (question.flipped) ? session.speaks : session.learning;
      self.currentLanguage = language;
      self.initPlayer(language);
    };

    self.updateTags = function () {
      var newTags = [];
      var tagsIndex = [];
      angular.forEach(self.question.tags, function (tag) {
        newTags.push(tag._id);
        tagsIndex.push(tag.text.translations[self.speaksCode]);
        tagsIndex.push(tag.text.translations[self.learningCode]);
      });
      var questionData = {
        tags: newTags,
        tags_index: tagsIndex.join()
      }
      Question.one(self.question._id).patch(questionData).then(function (question) {
        toaster.pop('success', "Tag Applied", "Question has been updated.");
      }, function (response) {
        toaster.pop('error', "Server Error", "There was a problem updating. Please try again in a few moments");
      }); 
    };

    self.addQuestion = function (question) {
      self.recordingQuestion = question;
      session.recordingQuestion = question;
      $modal.open({
        controller: 'ModalAddQuestionCtrl',
        controllerAs: 'modalAddQuestionCtrl',
        templateUrl: 'views/modal-add-question.html',
      });
    };

    self.showComment = function (recording) {
      session.commentingRecording = recording;
      var asideInstance = $aside.open({
        templateUrl: 'views/aside-recording-comments.html',
        controller: 'CommentsCtrl',
        controllerAs: 'commentsCtrl',
        placement: 'right',
        size: 'sm'
      });
    };
  }
]);


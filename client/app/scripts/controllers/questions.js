'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:QuestionsCtrl
 * @description
 * # QuestionsCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('QuestionsCtrl', [
  '$q',
  '$modal',
  '$aside',
  'toaster',
  'config',
  'Question',
  'session',
   function ($q, $modal, $aside, toaster, config, Question, session) {
    var self = this;

    self.isAdmin = (session.roles === "admin");
    self.speaksCode = session.speaks;
    self.learningCode = session.learning;
    self.page = 1;
    self.maxResults = 10;
    self.searchParams = null;

    Question.getList({embedded: {tags: 1}, max_results: self.maxResults, page: self.page}).then(function (questions) {
      self.questions = questions; 
    });

    self.loadMoreQuestions = function () {
      if (self.page !== 'end') {
        var params = {};
        if (self.searchParams) {
          params = searchParams;
        }
        params.max_results = self.maxResults;
        params.page = (self.page + 1);
        params.embedded = {
          tags: 1
        }
        Question.getList(params).then(function (questions) {
          if (questions) {
            self.page++
            questions.forEach(function (question) {
              self.questions.add(question);
            });
          } else {
            self.page = 'end';
          }
        });
      } 
    }

    self.createQuestionModal = function () {
      $modal.open({
        controller: 'QuestionsCtrl',
        controllerAs: 'questionsCtrl',
        templateUrl: 'views/modal-create-question.html'
      });
    };

    self.editTagsModal = function () {
      $modal.open({
        controller: 'TagsCtrl',
        controllerAs: 'tagsCtrl',
        templateUrl: 'views/modal-tags.html'
      });
    };

    self.showQuestionFilterModal = function () {
      $modal.open({
        controller: 'QuestionsCtrl',
        controllerAs: 'questionsCtrl',
        templateUrl: 'views/modal-question-filter.html'
      });
    };

    self.search = function () {
      var speaksFilter = {};
      var learningFilter = {};
      var tagsFilter = {
        "tags_index": {
          "$regex": ".*" + self.searchText + ".*",
          "$options": "i"
        }
      };
      speaksFilter['text.translations.' + session.speaks] = {
        "$regex": ".*" + self.searchText + ".*",
        "$options": "i"
      };
      learningFilter['text.translations.' + session.learning] = {
        "$regex": ".*" + self.searchText + ".*",
        "$options": "i"
      };
      var filter = {
        "$or": [
          speaksFilter,
          learningFilter,
          tagsFilter
        ]
      };
      var params = {
        "where": JSON.stringify(filter),
        "embedded": {
          "tags": 1
        }
      };

      self.searchParams = params;
      Question.getList(params).then(function (questions) {
        self.page = 1;
        self.questions = questions;
      });
    };

    self.createQuestion = function () {
      var translations = {};
      translations[session.speaks] = self.newQuestion.speaksText;
      translations[session.learning] = self.newQuestion.learningText;
      var questionData = {
        text: {
          languages: 2,
          original_language: session.speaks,
          translations: translations
        },
        status: 'submitted',
        submitted_by: session.userId
      };
      Question.post(questionData).then(function (question) {
        self.questions.add(question);
        toaster.pop('success', "Question Added", "Thanks for contributing!  Your question has been added.");
      }, function (response) {
        toaster.pop('error', "Server Problem", "There was a server problem.  Please try again in a few moments.");
      });
    };
    
    self.showHelp = function () {
      var asideInstance = $aside.open({
        templateUrl: 'views/aside-questions-help.html',
        placement: 'left',
        size: 'sm'
      });
    };

  }
]);


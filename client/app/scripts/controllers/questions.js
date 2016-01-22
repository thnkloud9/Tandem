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
  '$http',
  '$modal',
  '$aside',
  'mymemory',
  'duolingo',
  'toaster',
  'config',
  'Question',
  'PracticeSet',
  'session',
   function (
     $q,
     $http,
     $modal,
     $aside,
     mymemory,
     duolingo,
     toaster,
     config,
     Question,
     PracticeSet,
     session) {
    var self = this;

    self.isAdmin = (session.roles === "admin");
    self.page = 1;
    self.maxResults = 10;
    self.searchParams = null;
    self.speaksCode = session.speaks; // used in views
    self.learingingCode = session.learning; // used in views

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

    /**
     * Submit a new question to the backend api using
     * the Question service
     */  
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
        category: self.newQuestion.category,
        submitted_by: session.userId
      };
      Question.post(questionData).then(function (question) {
        self.questions.add(question);
        toaster.pop('success', "Question Added", "Thanks for contributing!  Your question has been added.");

        // see if we need to save this question to a practice_set
        if (session.saveToPracticeSetId) {
          // save new question id to practice_set
          PracticeSet.one(session.saveToPracticeSetId).get().then(function (practiceSet) {
            // TODO: this is dumb, why doesn't practiceSet.save() work?  wtf
            var questions = (practiceSet.questions) ? practiceSet.questions : [];
            var practiceSetData = {
              questions: []
            };
            questions.push(question._id);
            practiceSetData.questions = questions            
            PracticeSet.one(practiceSet._id).patch(practiceSetData).then(function () {
              toaster.pop('success', "Added to PracticeSet", "Question has been added to your practiceSet");
            }, function () {
              toaster.pop('error', "Failed to add to PracticeSet", "Failed adding question to your practiceSet");
            });
          });
          session.saveToPracticeSetId = undefined;
        }

      }, function (response) {
        toaster.pop('error', "Server Problem", "There was a server problem.  Please try again in a few moments.");
      });

    };

    /**
     * Uses mymemory api service to translate words and phrases
     * as google translate is too expensive
     */
    self.translateQuestion = function (text, origin) {
      mymemory.translateText(text, origin).then(function (matches) {
        var translation = matches[0].translation;
        var hintsOrigin = null;

        if (origin === 'speaks') {
          self.newQuestion.learningText = translation;
          self.newQuestion.learningTranslations = matches;
          hintsOrigin = 'learning';          
        } else {
          self.newQuestion.speaksText = translation;
          self.newQuestion.speaksTranslations = matches;
          hintsOrigin = 'speaks';          
        }

        // now get translation word hints
        duolingo.getTextHints(translation, hintsOrigin).then(function (hints) {
          console.log(hints);
          //TODO: do something with hints
        }, function () {
          // TODO: what should we do if we fail getting hints
        });

      }, function (response) {
        toaster.pop('error', "Translation Problem", "There was a problem with the translation service.  Please try again in a few minutes");
      });
    };
  
    /**
     * Opens help aside
     */  
    self.showHelp = function () {
      var asideInstance = $aside.open({
        templateUrl: 'views/aside-questions-help.html',
        placement: 'left',
        size: 'sm'
      });
    };

  }
]);


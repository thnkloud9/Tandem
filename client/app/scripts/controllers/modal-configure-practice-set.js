'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:ModalConfigurePracticeSetctrl
 * @description
 * # ModalPlayPracticeSetctrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('ModalConfigurePracticeSetCtrl', [
  '$scope',
  '$http',
  '$modal',
  'toaster',
  'PracticeSet',
  'Question',
  'session',
  'config',
   function ($scope, $http, $modal, toaster, PracticeSet, Question, session, config) {
    var self = this;

    self.isAdmin = (session.roles === "admin");
    self.learningCode = session.learning;
    self.page = 1;
    self.maxResults = 10;
    self.searchParams = null;
    self.availableQuestions = [];
    self.selectedQuestion = null;
    self.practiceSet = {
      questions: [],
      questionIds: []
    };

    $scope.$watch(angular.bind(session, function () {
      return session.configuringPracticeSet;
    }), function (newVal, oldVal) {
      self.practiceSet = newVal;
console.log('this gets called', self.practiceSet);
      self.practiceSet.hydrateQuestions().then(function (loadedQuestions) {
console.log('after hydrate', loadedQuestions);
        var params = {
          embedded: {tags: 1},
          max_results: self.maxResults,
          page: self.page
        }; 
        Question.getList(params).then(function (questions) {
console.log('after getList', questions);
          // only add questions that are not already in the practice_set
          angular.forEach(questions, function(question) {
            if (self.practiceSet.questionIds.indexOf(question._id) === -1) {
              self.availableQuestions.push(question);
            }
          });
        });
      });
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

    self.createQuestionModal = function () {
      // set practice_set id to ensure new questions are added to this practice_set
      session.saveToPracticeSetId = self.practiceSet._id;
      $modal.open({
        controller: 'QuestionsCtrl',
        controllerAs: 'questionsCtrl',
        templateUrl: 'views/modal-create-question.html'
      });
    };
 
    self.savePracticeSet = function () {
      var practiceSetData = {};
      
      practiceSetData.category = self.practiceSet.category;
      practiceSetData.questions = _.pluck(self.practiceSet.questions, '_id');
      PracticeSet.one(self.practiceSet._id).patch(practiceSetData).then(function() {
        toaster.pop('success', "Practice Set Updated", "The practice set has been updated succefully.");
      }, function () {
        toaster.pop('error', "Server Problem", "Please try again in a few moments.");
      });
    }
  }
]);

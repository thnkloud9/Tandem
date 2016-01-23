(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name tandemWebApp.controller:ModalConfigurePracticeSetctrl
   * @description
   * # ModalPlayPracticeSetctrl
   * Controller of the tandemWebApp
   */
  angular.module('app.practiceSets').controller('EditPracticeSetModalController', [
    '$scope',
    '$http',
    'Notify',
    'PracticeSet',
    'Question',
    'session',
    'APP_CONFIG',
    'editingSet',
     function (
     $scope,
     $http,
     Notify,
     PracticeSet,
     Question,
     session,
     APP_CONFIG,
     editingSet) {
      var self = this;

      self.isAdmin = (session.roles === "admin");
      self.page = 1;
      self.maxResults = 10;
      self.searchParams = null;
      self.availableQuestions = [];
      self.selectedQuestion = null;
      self.newQuestion = {};

      self.practiceSet = editingSet;

      self.practiceSet.hydrateQuestions().then(function (loadedQuestions) {
        var params = {
          embedded: {tags: 1},
          max_results: self.maxResults,
          page: self.page
        }; 
        Question.getList(params).then(function (questions) {
          // only add questions that are not already in the practice_set
          angular.forEach(questions, function(question) {
            if (self.practiceSet.questionIds.indexOf(question._id) === -1) {
              self.availableQuestions.push(question);
            }
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
                if (self.practiceSet.questionIds.indexOf(question._id) === -1) {
                  self.avilableQuestions.add(question);
                }
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
        self.page = 1;
        self.availableQuestions = [];
        Question.getList(params).then(function (questions) {
          // only add questions that are not already in the practice_set
          angular.forEach(questions, function(question) {
            if (self.practiceSet.questionIds.indexOf(question._id) === -1) {
              self.availableQuestions.push(question);
            }
          });
        });
      };

      self.clearNewQuestion = function() {
        self.newQuestion.speaksText = 'Click here to enter ' + session.speaksText;
        self.newQuestion.learningText = 'Click here to enter ' + session.learningText;
      };

      /**
       * Submit a new question to the server api using
       * the Question service
       */  
      self.saveQuestion = function () {
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

        // add the new question first
        Question.post(questionData).then(function (question) {

          Notify.alert("Question added.", {status: 'success'});

          Question.one(question._id).get().then(function (loadedQuestion) {
            self.practiceSet.questions.push(loadedQuestion);
        
            // save new question id to practice_set
            var questions = (self.practiceSet.questions) ?
              _.pluck(self.practiceSet.questions, '_id') : [];
            questions.push(question._id);
            var practiceSetData = {
              questions: []
            };
            practiceSetData.questions = questions            
            PracticeSet.one(self.practiceSet._id).patch(practiceSetData).then(function () {
              Notify.alert("Added to PracticeSet", {status: 'success'});
              self.clearNewQuestion();
            }, function () {
              Notify.alert("Failed to add to PracticeSet", {status: 'danger'});
            });
          }, function (response) {
            Notify.alert("Failed to add to PracticeSet", {status: 'danger'});
          });
        }, function (response) {
          Notify.alert("Server Problem", {status: 'danger'});
        });

      };

      self.addQuestion = function (question) {
        // save new question id to practice_set
        var questions = (self.practiceSet.questions) ?
          _.pluck(self.practiceSet.questions, '_id') : [];
        questions.push(question._id);
        var practiceSetData = {
          questions: []
        };
        practiceSetData.questions = questions
        PracticeSet.one(self.practiceSet._id).patch(practiceSetData).then(function () {
          Notify.alert("Added to PracticeSet", {status: 'success'});
          self.practiceSet.questions.push(question);
          self.availableQuestions = self.availableQuestions.filter(function (q) {
            return q._id !== question._id;
          });
        }, function () {
          Notify.alert("Failed to add to PracticeSet", {status: 'danger'});
        });
      };

      self.removeQuestion = function (question) {
        // save new question id to practice_set
        var questions = (self.practiceSet.questions) ?
          _.pluck(self.practiceSet.questions, '_id') : [];
        var practiceSetData = {
          questions: []
        };
        practiceSetData.questions = _.without(questions, question._id);
        PracticeSet.one(self.practiceSet._id).patch(practiceSetData).then(function () {
          Notify.alert("Added to PracticeSet", {status: 'success'});
          self.availableQuestions.push(question);
          self.practiceSet.questions = self.practiceSet.questions.filter(function (q) {
            return q._id !== question._id;
          });
        }, function () {
          Notify.alert("Failed to add to PracticeSet", {status: 'danger'});
        });
      };

      self.savePracticeSet = function () {
        var practiceSetData = {};
        
        practiceSetData.category = self.practiceSet.category;
        practiceSetData.questions = _.pluck(self.practiceSet.questions, '_id');
        practiceSetData.description = self.practiceSet.description;
        practiceSetData.title = self.practiceSet.title;
        PracticeSet.one(self.practiceSet._id).patch(practiceSetData).then(function() {
          Notify.alert("Practice Set updated.", {status: 'success'});
        }, function () {
          Notify.alert( "Server Problem.", {status: 'success'});
        });
      };

    } // end activate
  ]);
})();

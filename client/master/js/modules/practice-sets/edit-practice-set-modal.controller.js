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
      var vm = this;

      vm.isAdmin = (session.roles === "admin");
      vm.maxResults = 99999;
      vm.searchParams = null;
      vm.availableQuestions = [];
      vm.selectedQuestion = null;
      vm.newQuestion = {};
      vm.selected = [];
      vm.addedSelected = [];

      vm.practiceSet = editingSet;

      vm.practiceSet.hydrateQuestions().then(function (addedQuestions) {
        vm.practiceSet.questionIds = _.pluck(addedQuestions, '_id'); 
        var where = {
          "_id": { "$nin": vm.practiceSet.questionIds }
        }
        var params = {
          "where": JSON.stringify(where),
          "embedded": { "tags": 1 },
          max_results: vm.maxResults,
        }; 
        Question.getList(params).then(function (questions) {
          vm.totalAvailable = questions._meta.total;
          vm.availableQuestions = questions;
        });
      });

      vm.search = function (added) {
        var speaksFilter = {};
        var learningFilter = {};
        var searchText = (added) ? vm.addedSearchText : vm.searchText;
        var tagsFilter = {
          "tags_index": {
            "$regex": ".*" + searchText + ".*",
            "$options": "i"
          }
        };
        speaksFilter['text.translations.' + session.speaks] = {
          "$regex": ".*" + searchText + ".*",
          "$options": "i"
        };
        learningFilter['text.translations.' + session.learning] = {
          "$regex": ".*" + searchText + ".*",
          "$options": "i"
        };

        if (added) {
          var filter = {
            "$and": [
              { "_id": { "$in": vm.practiceSet.questionIds }},
              { "$or": [ speaksFilter, learningFilter, tagsFilter ] }
            ]
          };
          var params = {
            "where": JSON.stringify(filter),
            "embedded": {
              "tags": 1
            }
          };

          vm.searchParams = params;
          vm.availableQuestions = [];
          Question.getList(params).then(function (questions) {
            vm.addedTotalAvailable = questions._meta.total
            vm.practiceSet.questions = questions;
          });
        } else {
          var filter = {
            "$and": [
              { "_id": { "$nin": vm.practiceSet.questionIds }},
              { "$or": [ speaksFilter, learningFilter, tagsFilter ] }
            ]
          };
          var params = {
            "where": JSON.stringify(filter),
            "embedded": {
              "tags": 1
            }
          };

          vm.searchParams = params;
          vm.availableQuestions = [];
          Question.getList(params).then(function (questions) {
            vm.totalAvailable = questions._meta.total;
            vm.availableQuestions = questions;
          });
        }
      };

      vm.clearNewQuestion = function() {
        vm.newQuestion.speaksText = 'Click here to enter ' + session.speaksText;
        vm.newQuestion.learningText = 'Click here to enter ' + session.learningText;
      };

      /**
       * Submit a new question to the server api using
       * the Question service
       */  
      vm.saveQuestion = function () {
        var translations = {};
        translations[session.speaks] = vm.newQuestion.speaksText;
        translations[session.learning] = vm.newQuestion.learningText;
        var questionData = {
          text: {
            languages: 2,
            original_language: session.speaks,
            translations: translations,
          },
          status: 'submitted',
          category: 'word',
          submitted_by: session.userId
        };

        // add the new question first
        Question.post(questionData).then(function (question) {

          Notify.alert("Question added.", {status: 'success'});

          Question.one(question._id).get().then(function (loadedQuestion) {
            vm.practiceSet.questions.push(loadedQuestion);
        
            // save new question id to practice_set
            var questions = (vm.practiceSet.questions) ?
              _.pluck(vm.practiceSet.questions, '_id') : [];
            questions.push(question._id);
            var practiceSetData = {
              questions: []
            };
            practiceSetData.questions = questions            
            PracticeSet.one(vm.practiceSet._id).patch(practiceSetData).then(function () {
              Notify.alert("Added to PracticeSet", {status: 'success'});
              vm.clearNewQuestion();
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

      vm.addQuestion = function (question) {
        // save new question id to practice_set
        var questions = (vm.practiceSet.questions) ?
          _.pluck(vm.practiceSet.questions, '_id') : [];
        questions.push(question._id);
        var practiceSetData = {
          questions: []
        };
        practiceSetData.questions = questions
        PracticeSet.one(vm.practiceSet._id).patch(practiceSetData).then(function () {
          Notify.alert("Added to PracticeSet", {status: 'success'});
          vm.practiceSet.questions.push(question);
          vm.availableQuestions = vm.availableQuestions.filter(function (q) {
            return q._id !== question._id;
          });
        }, function () {
          Notify.alert("Failed to add to PracticeSet", {status: 'danger'});
        });
      };

      vm.addAllSelected = function () {
        angular.forEach(vm.availableQuestions, function (question) {
          if (vm.selected.indexOf(question._id) > -1) {
            vm.addQuestion(question);
          }
        });
        // Reset the search, otherwise paging gets weird
        vm.search();
      };

      vm.removeAllSelected = function () {
        angular.forEach(vm.tag.questions, function (question) {
          if (vm.selected.indexOf(question._id) > -1) {
            vm.removeQuestion(question);
          }
        });
        // Reset the search, otherwise paging gets weird
        vm.search();
      };

      vm.removeQuestion = function (question) {
        // save new question id to practice_set
        var questions = (vm.practiceSet.questions) ?
          _.pluck(vm.practiceSet.questions, '_id') : [];
        var practiceSetData = {
          questions: []
        };
        practiceSetData.questions = _.without(questions, question._id);
        PracticeSet.one(vm.practiceSet._id).patch(practiceSetData).then(function () {
          Notify.alert("Added to PracticeSet", {status: 'success'});
          vm.availableQuestions.push(question);
          vm.practiceSet.questions = vm.practiceSet.questions.filter(function (q) {
            return q._id !== question._id;
          });
        }, function () {
          Notify.alert("Failed to add to PracticeSet", {status: 'danger'});
        });
      };

      vm.toggleAll = function () {
        if (vm.allSelected) {
          vm.selected = [];
          vm.allSelected = false;
        } else {
          vm.selected = _.pluck(vm.availableQuestions, '_id');
          vm.allSelected = true;
        }  
      };

      vm.addedToggleAll = function () {
        if (vm.addedAllSelected) {
          vm.addedSelected = [];
          vm.addedAllSelected = false;
        } else {
          vm.addedSelected = _.pluck(vm.practiceSet.questions, '_id');
          vm.addedAllSelected = true;
        }  
      };

      vm.toggleSelected = function (questionId) {
        var idx = vm.selected.indexOf(questionId);
        if (idx > -1) {
          vm.selected.splice(idx, 1);
        } else {
          vm.selected.push(questionId);
        } 
      };

      vm.addedToggleSelected = function (questionId) {
        var idx = vm.addedSelected.indexOf(questionId);
        if (idx > -1) {
          vm.addedSelected.splice(idx, 1);
        } else {
          vm.addedSelected.push(questionId);
        } 
      };

      vm.savePracticeSet = function () {
        var practiceSetData = {};
        
        practiceSetData.category = vm.practiceSet.category;
        practiceSetData.questions = _.pluck(vm.practiceSet.questions, '_id');
        practiceSetData.description = vm.practiceSet.description;
        practiceSetData.title = vm.practiceSet.title;
        PracticeSet.one(vm.practiceSet._id).patch(practiceSetData).then(function() {
          Notify.alert("Practice Set updated.", {status: 'success'});
        }, function () {
          Notify.alert( "Server Problem.", {status: 'success'});
        });
      };

    } // end activate
  ]);
})();

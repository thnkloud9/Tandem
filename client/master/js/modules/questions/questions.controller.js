(function() {
    'use strict';

    angular.module('app.questions').controller('QuestionsController', [
      '$scope',
      '$q',
      '$uibModal',
      'ngDialog',
      'RouteHelpers',
      'APP_CONFIG',
      'Question',
      'session',
      'Notify',
      function QuestionsController(
          $scope,
          $q,
          $uibModal,
          ngDialog,
          helper,
          APP_CONFIG,
          Question,
          session,
          Notify) {
            var vm = this;

            activate();

            ////////////////

            function activate() {
              vm.page = 1;
              vm.maxResults = 20;
              vm.searchParams = null;
              vm.session = session;

              Question.getList({
                embedded: {tags: 1},
                max_results: vm.maxResults,
                page: vm.page,
                sort: '-_created',
              }).then(function (questions) {
                vm.questions = questions;
              });

              vm.loadMore = function () {
                if (vm.page !== 'end') {
                  var params = {};
                  if (vm.searchParams) {
                    params = searchParams;
                  }
                  params.max_results = vm.maxResults;
                  params.page = (vm.page + 1);
                  params.embedded = {
                    tags: 1
                  }
                  Question.getList(params).then(function (questions) {
                    if (questions) {
                      vm.page++
                      questions.forEach(function (question) {
                        vm.questions.add(question);
                      });
                    } else {
                      vm.page = 'end';
                    }
                  });
                } 
              }

              vm.search = function () {
                var speaksFilter = {};
                var learningFilter = {};
                var tagsFilter = {
                  "tags_index": {
                    "$regex": ".*" + vm.searchText + ".*",
                    "$options": "i"
                  }
                };
                speaksFilter['text.translations.' + session.speaks] = {
                  "$regex": ".*" + vm.searchText + ".*",
                  "$options": "i"
                };
                learningFilter['text.translations.' + session.learning] = {
                "$regex": ".*" + vm.searchText + ".*",
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

              vm.searchParams = params;
              Question.getList(params).then(function (questions) {
                vm.page = 1;
                vm.questions = questions;
              });

            };

            // TODO: change this to an ngDialog like tag create
            // and add the createQuestion function here
            vm.openCreateQuestionModal = function () {
              vm.newQuestion = {};
              $scope.newQuestion = vm.newQuestion;
              ngDialog.openConfirm({
                template: 'app/views/modals/create-question.html',
                className: 'ngdialog-theme-default',
                scope: $scope 
              }).then(function (value) {
                vm.createQuestion();
              }, function (reason) {
                console.log('cancelled create', reason);
              });
            };

            vm.clearNewQuestion = function () {
              vm.newQuestion.speaksText = 'Click here to enter ' + session.speaksText;
              vm.newQuestion.learningText = 'Click here to enter ' + session.learningText;
            };

            vm.createQuestion = function () {
              var translations = {};
              translations[session.speaks] = vm.newQuestion.speaksText;
              translations[session.learning] = vm.newQuestion.learningText;
              var newQuestion = {
                text: {
                  languages: APP_CONFIG.languages.length,
                  original_language: session.speaks,
                  translations: translations,
                },
                category: 'phrase',
                submitted_by: session.userId,
                status: 'submitted'
              };

console.log('adding', newQuestion);
              Question.post(newQuestion).then(function (question) {
                _.extend(question, newQuestion);
                // add to the sets list
                vm.questions.add(question);
                vm.clearNewQuestion();
                Notify.alert('Question added.', {status: 'success'});
              }, function (response) {
                Notify.alert('There was a problem adding your tag.', {status: 'error'});
              });
            };

            vm.openAddQuestionAudioModal = function (question) {
              var modalInstance = $uibModal.open({
                templateUrl: 'app/views/modals/add-question-audio.html',
                controller: 'AddQuestionAudioModalController',
                controllerAs: 'addAudio',
                resolve: {
                  recordingQuestion: function () {
                    return question;
                  }
                },
                size: 'lg'
              });

              var state = $('#modal-state');
              modalInstance.result.then(function () {
                console.log('dismissed with OK');
                // update question in questions list
              }, function () {
                console.log('dismissed with Cancel');
              });  
            };

          } // end activate
        }
    ]);
})();

(function() {
    'use strict';

    angular.module('app.questions').controller('QuestionsController', [
      '$rootScope',
      '$scope',
      '$uibModal',
      'ngDialog',
      'RouteHelpers',
      'APP_CONFIG',
      'Question',
      'speechSynth',
      'session',
      'Notify',
      function QuestionsController(
        $rootScope,
        $scope,
        $uibModal,
        ngDialog,
        helper,
        APP_CONFIG,
        Question,
        speechSynth,
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
            vm.cardBack = 1;

            Question.getList({
              embedded: {
                tags: 1,
                submitted_by: 1
              },
              max_results: vm.maxResults,
              page: vm.page,
              sort: '-_created',
            }).then(function (questions) {
              vm.questions = questions;
            });

            // TODO: figure out what to do with dplicate requests for the
            // same page, cuz this happens a lot already
            vm.loadMore = function () {
              if ((!vm.questions) ||
                  (vm.waitingForPage) ||
                  (vm.page >= vm.maxPage)) {
                return false;
              }
              if (vm.page !== 'end') {
                var params = {};
                if (vm.searchParams) {
                  params = vm.searchParams;
                }
                params.max_results = vm.maxResults;
                params.page = (vm.page + 1);
                params.embedded = {
                  tags: 1,
                  submitted_by: 1
                }
                vm.waitingForPage = true;
                Question.getList(params).then(function (questions) {
                  if (questions) {
                    vm.page++
                    questions.forEach(function (question) {
                      vm.questions.add(question);
                    });
                    vm.waitingForPage = false;
                    vm.maxPage = Math.ceil(questions._meta.total / vm.maxResults);
                  } else {
                    vm.page = 'end';
                  }
                });
              }
            };

            vm.changeCardBack = function (index) {
              vm.cardBack = (vm.cardBack > 5) ? 1 : vm.cardBack + 1;
              return vm.cardBack;
            };

            vm.search = function () {
              var params = {
                "embedded": {
                  "tags": 1,
                  "submitted_by": 1
                }
              };

              Question.searchByText(vm.searchText, {}, params).then(function (results) {
                vm.page = 1;
                vm.questions = results.questions;
                vm.searchParams = results.params;
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

            $rootScope.$on('topNavSearch', function (event, args) {
              vm.searchText = args.text
              vm.search();
            });
            
            vm.speak = function (question) {
              var text = question.text.translations[session.learning];
              speechSynth.speak(text, session.learning);
            }
          } // end activate
        }
    ]);
})();

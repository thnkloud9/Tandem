(function() {
    'use strict';

    angular.module('app.questions').controller('QuestionsController', [
      '$scope',
      '$q',
      '$uibModal',
      'RouteHelpers',
      'Question',
      'session',
      'Notify',
      function QuestionsController(
          $scope,
          $q,
          $uibModal,
          helper,
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

              Question.getList({embedded: {tags: 1}, max_results: vm.maxResults, page: vm.page}).then(function (questions) {
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

            vm.openCreateQuestionModal = function () {
              var modalInstance = $uibModal.open({
                templateUrl: 'app/views/modals/create-question.html',
                controller: 'CreateQuestionModalController',
                controllerAs: 'createQuestion',
                size: 'lg'
              });

              var state = $('#modal-state');
              modalInstance.result.then(function () {
                console.log('dismissed with OK');
                // add question to questions list
              }, function () {
                console.log('dismissed with Cancel');
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

            vm.openImageSelectModal = function (question) {
              var modalInstance = $uibModal.open({
                templateUrl: 'app/views/modals/image-select.html',
                controller: 'ImageSelectModalController',
                controllerAs: 'imageSelect',
                resolve: {
                  referenceObject: function () {
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

(function() {
    'use strict';

    angular.module('app.tags')
      .controller('TagsController', [
      '$scope',
      '$q',
      'RouteHelpers',
      'APP_CONFIG',
      'Tag',
      'session',
      '$uibModal',
      'ngDialog',
      'Notify',
      function ProfileViewController(
        $scope,
        $q,
        helper,
        APP_CONFIG,
        Tag,
        session,
        $uibModal,
        ngDialog,
        Notify) {
          var vm = this;

          activate();

          ////////////////

          function activate() {

            vm.page = 1;
            vm.maxResults = 25;
            vm.session = session;

            // load first page of tags
            Tag.getList({max_results: vm.maxResults, page: vm.page}).then(function (tags) {
              vm.tags = tags;
            });

            // can be called with infinite load
            vm.loadMoreTags = function () {
              if (vm.page !== 'end') {
                var params = {};
                if (vm.searchParams) {
                  params = searchParams;
                }
                params.max_results = vm.maxResults;
                params.page = (vm.page + 1);
                Tag.getList(params).then(function (tags) {
                  if (tags) {
                    vm.page++
                    tags.forEach(function (tag) {
                      vm.tags.add(tag);
                    });
                  } else {
                    vm.page = 'end';
                  }
                });
              } 
            };

            vm.editTag= function (tag) {
              var modalInstance = $uibModal.open({
                templateUrl: 'app/views/modals/edit-tag.html',
                controller: 'EditTagModalController',
                controllerAs: 'editTag',
                resolve: angular.extend(helper.resolveFor('xeditable'),{
                  editingTag: function () {
                    return tag;
                  }
                }),
                size: 'lg'
              });

              var state = $('#modal-state');
              modalInstance.result.then(function () {
                console.log('dismissed with OK');
                // update tag in tag list
                vm.tags = vm.tags.filter(function (t) {
                  return t._id !== tag._id;
                });
                vm.tags.push(tag);
              }, function () {
                console.log('dismissed with Cancel');
              });  
            };

            vm.openImageSelectModal = function (tag) {
              var modalInstance = $uibModal.open({
                templateUrl: 'app/views/modals/image-select.html',
                controller: 'ImageSelectModalController',
                controllerAs: 'imageSelect',
                resolve: {
                  referenceObject: function () {
                    return tag;
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

            vm.clearNewTag = function () {
              vm.newTag.speaksText = 'Click here to enter ' + session.speaksText;
              vm.newTag.learningText = 'Click here to enter ' + session.learningText;
            };

            vm.openCreateTagModal = function (question) {
              vm.newTag = {};
              $scope.newTag = vm.newTag;
              ngDialog.openConfirm({
                template: 'app/views/modals/create-tag.html',
                className: 'ngdialog-theme-default',
                scope: $scope 
              }).then(function (value) {
                vm.createTag();
              }, function (reason) {
                console.log('cancelled create', reason);
              });
            };


            vm.createTag = function () {
              var text = {};
              text[session.speaks] = vm.newTag.speaksText;
              text[session.learning] = vm.newTag.learningText;
              var newTag = {
                text: {
                  languages: APP_CONFIG.languages.length,
                  original_language: session.speaks,
                  translations: text 
                },
                submitted_by: session.userId,
                status: 'submitted'
              };

              Tag.post(newTag).then(function (tag) {
                _.extend(tag, newTag);
                // add to the sets list
                vm.tags.add(tag);
                vm.clearNewTag();
                Notify.alert('Tag added.', {status: 'success'});
              }, function (response) {
                Notify.alert('There was a problem adding your tag.', {status: 'error'});
              });
            };

          } // activate END
        }
    ]);
})();

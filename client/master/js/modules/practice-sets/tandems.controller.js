(function() {
    'use strict';

    angular.module('app.practiceSets').controller('TandemsController', [
      '$scope',
      '$q',
      '$uibModal',
      'ngDialog',
      'RouteHelpers',
      'PracticeSet',
      'APP_CONFIG',
      'session',
      'modalFactory',
      'Notify',
      function TandemsController(
          $scope,
          $q,
          $uibModal,
          ngDialog,
          helper,
          PracticeSet,
          APP_CONFIG,
          session,
          modalFactory,
          Notify) {
            var vm = this;

            activate();

            ////////////////

            function activate() {

              vm.session = session;
              vm.params = {
                "where": { 
                  "submitted_by": session.userId,
                  "category": "tandem"
                },
                "sort": "_created",
              };

              PracticeSet.getList(vm.params).then(function (sets) {
                vm.sets = sets; 
              }, function() {
                Notify.alert('There was a problem loading your sets.', {status: 'warning'});
              });

              vm.playPracticeSet = function (set) {
                $uibModal.open({
                  controller: 'PlayTandemPracticeSetModalController',
                  controllerAs: 'modalPlay',
                  templateUrl: 'app/views/modals/play-tandem-practice-set.html',
                  resolve: {
                    playingSet: function () {
                      return set;
                    }
                  },
                  size: 'lg'
                });
              };

              vm.editPracticeSet = function (set) {
                 $uibModal.open({
                  controller: 'EditPracticeSetModalController',
                  controllerAs: 'modalEdit',
                  templateUrl: 'app/views/modals/edit-practice-set.html',
                  resolve: angular.extend(helper.resolveFor('slimscroll'), {
                    editingSet: function () {
                      return set;
                    }
                  }),
                  size: 'lg'
                });
              };

              vm.schedulePracticeSet = function (setId) {
                 $uibModal.open({
                  controller: 'SchedulePracticeSetModalController',
                  controllerAs: 'modalSchedule',
                  templateUrl: 'app/views/modals/schedule-practice-set.html',
                  resolve: {
                    practiceSetId: function () {
                      return setId;
                    }
                  },
                  size: 'lg'
                });
              };

              vm.reviewPracticeSet = function (set) {
                 $uibModal.open({
                  controller: 'ReviewPracticeSetModalController',
                  controllerAs: 'modalReview',
                  templateUrl: 'app/views/modals/review-practice-set.html',
                  resolve: {
                    practiceSet: function () {
                      return set;
                    }
                  },
                  size: 'lg'
                });
              };

              vm.openCreateTandemModal = function () {
                vm.newSet = {};
                $scope.newSet = vm.newSet;
                ngDialog.openConfirm({
                  template: 'app/views/modals/create-set.html',
                  className: 'ngdialog-theme-default',
                  scope: $scope
                }).then(function (value) {
                  vm.createPracticeSet();
                }, function (reason) {
                  console.log('cancelled create', reason);
                });
              };

              vm.createPracticeSet = function () {
                var newSet = PracticeSet.newEmptySet();
                newSet.description.translations[session.speaks] = vm.newSet.description;
                newSet.title =  vm.newSet.title;
                newSet.category = 'tandem';

                PracticeSet.post(newSet).then(function (practiceSet) {
                  // TODO: not sure why we don't get all our fields back after a post
                  _.extend(practiceSet, newSet);
                  // add to the sets list
                  vm.sets.add(practiceSet);
                  vm.clearNewSet();
                  Notify.alert('Practice set added.', {status: 'success'});
                }, function (response) {
                  Notify.alert('There was a problem adding your set.', {status: 'error'});
                });
              };

              vm.clearNewSet = function () {
                vm.newSet.title = 'Click here to enter title';
                vm.newSet.description = 'Click here to enter description';
              }

              vm.deletePracticeSet = function (setId) {
                var modal;
                var title = 'Do you really want to delete this Practice Set?';
                var text = 'Questions associated with this ' +
                  'Practice Set can always be re-assigned again.';

                modal = modalFactory.confirmLight(title, text);
                modal.result.then(function () {
                  return PracticeSet.one(setId).remove(setId);
                }, $q.reject)
                .then(function () {
                  Notify.alert("Practice set deleted. However, any questions and audio assocaited with it remain on the server.");
                  _.remove(vm.sets, {_id: setId});
                });
              };

            } // end activate
        }
    ]);
})();

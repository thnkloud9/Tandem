(function() {
    'use strict';

    angular.module('app.practiceSets').controller('WordListsController', [
      '$scope',
      '$q',
      '$uibModal',
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
          helper,
          PracticeSet,
          APP_CONFIG,
          session,
          modalFactory,
          Notify) {
            var self = this;

            activate();

            ////////////////

            function activate() {

              self.session = session;
              self.params = {
                "where": {
                  "submitted_by": session.userId,
                  "category": "memorize"
                },
                "sort": "_created",
              };

              PracticeSet.getList(self.params).then(function (sets) {
                self.sets = sets; 
              }, function() {
                Notify.alert('There was a problem loading your sets.', {status: 'warning'});
              });

              self.playPracticeSet = function (set) {
                $uibModal.open({
                  controller: 'PlayMemorizePracticeSetModalController',
                  controllerAs: 'modalPlay',
                  templateUrl: 'app/views/modals/play-memorize-practice-set.html',
                  resolve: {
                    playingSet: function () {
                      return set;
                    }
                  },
                  size: 'lg'
                });
              };

              self.editPracticeSet = function (set) {
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

              self.schedulePracticeSet = function (setId) {
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

              self.createPracticeSet = function () {
                var newSet = PracticeSet.newEmptySet();
                newSet.description.translations[session.speaks] = self.newSet.description;
                newSet.title = self.newSet.title;
                newSet.category = 'memorize';

                PracticeSet.post(newSet).then(function (practiceSet) {
                  // TODO: not sure why we don't get all our fields back after a post
                  _.extend(practiceSet, newSet);
                  // add to the sets list
                  self.sets.add(practiceSet);
                  self.clearNewSet();
                  Notify.alert('Word List added.', {status: 'success'});
                }, function (response) {
                  Notify.alert('There was a problem adding your Word List.', {status: 'error'});
                });
              };

              self.clearNewSet = function () {
                self.newSet.title = 'Click here to enter title';
                self.newSet.description = 'Click here to enter description';
              }

              self.deletePracticeSet = function (setId) {
                var modal;
                var title = 'Do you really want to delete this Word List?';
                var text = 'Questions associated with this ' +
                  'Practice Set can always be re-assigned again.';

                modal = modalFactory.confirmLight(title, text);
                modal.result.then(function () {
                  return PracticeSet.one(setId).remove(setId);
                }, $q.reject)
                .then(function () {
                  Notify.alert("Word List set deleted. However, any questions and audio assocaited with it remain on the server.");
                  _.remove(self.sets, {_id: setId});
                });
              };

            } // end activate
        }
    ]);
})();
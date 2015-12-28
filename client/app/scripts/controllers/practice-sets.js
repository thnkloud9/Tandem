'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:PracticeSetsCtrl
 * @description
 * # PracticeSetsCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('PracticeSetsCtrl', [
  '$q',
  '$modal',
  '$aside',
  '$route',
  'toaster',
  'modalFactory',
  'session',
  'PracticeSet',
  function ($q, $modal, $aside, $route, toaster, modalFactory, session, PracticeSet) {
    var self = this;

    var params = {
      "where": { "submitted_by": session.userId },
      "sort": "_created",
    };

    PracticeSet.getList(params).then(function (practiceSets) {
      self.practiceSets = practiceSets; 
    });

    self.createPracticeSetModal = function () {
      $modal.open({
        controller: 'PracticeSetsCtrl',
        controllerAs: 'practiceSetsCtrl',
        templateUrl: 'views/modal-create-practice-set.html',
      });
    };

    self.playPracticeSetModal = function (practiceSet) {
      session.playingPracticeSet = practiceSet;
      $modal.open({
        controller: 'ModalPlayPracticeSetCtrl',
        controllerAs: 'modalPlayPracticeSetCtrl',
        templateUrl: 'views/modal-play-practice-set.html'
      });
    };

    self.schedulePracticeSetModal = function (practiceSet) {
      session.schedulingPracticeSet = practiceSet;
      $modal.open({
        controller: 'ModalSchedulePracticeSetCtrl',
        controllerAs: 'modalSchedulePracticeSetCtrl',
        templateUrl: 'views/modal-schedule-practice-set.html'
      });
    };

    self.configurePracticeSetModal = function (practiceSet) {
      session.configuringPracticeSet = practiceSet;
      $modal.open({
        controller: 'ModalConfigurePracticeSetCtrl',
        controllerAs: 'modalConfigurePracticeSetCtrl',
        templateUrl: 'views/modal-configure-practice-set.html'
      });
    };

    self.createPracticeSet = function () {
      var newPracticeSet = {
        title: self.newPracticeSet.title,
        submitted_by: session.userId,
        category: self.newPracticeSet.category
      };
      PracticeSet.post(newPracticeSet).then(function (practiceSet) {
        self.practiceSets.add(practiceSet);
        // hack to get list to refresh
        $route.reload();
        toaster.pop('success', "Practice Set Added", "Now add some questions to it.");
      }, function (response) {
        toaster.pop('error', "Server Problem", "Please try again in a few moments.");
      });
    };

    self.removePracticeSet = function (practiceSetId) {
      var modal;
      var title = 'Do you really want to remove this Practice Set?';
      var text = 'Questions associated with this ' +
        'Practice Set can always be re-assigned again.';

      modal = modalFactory.confirmLight(title, text);
      modal.result.then(function () {
        return PracticeSet.one(practiceSetId).remove(practiceSetId);
      }, $q.reject)
      .then(function () {
        toaster.pop('success', "Practice Set Removed", "However, any questions and audio assocaited with it remain on the server.");
        _.remove(self.practiceSets, {_id: practiceSetId});
      });
    };
    
    self.showHelp = function () {
      var asideInstance = $aside.open({
        templateUrl: 'views/aside-practice-sets-help.html',
        placement: 'left',
        size: 'sm'
      });
    };

  }
]);

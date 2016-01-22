'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:QuestionsCtrl
 * @description
 * # NavCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('NavCtrl', [
  '$modal',
  '$aside',
  'session',
  function ($modal, $aside, session) {
    var self = this;

    self.isAdmin = (session.roles === "admin");

    /**
     * Opens tags editor
     */  
    self.editTagsModal = function () {
console.log('hey');
      $modal.open({
        controller: 'TagsCtrl',
        controllerAs: 'tagsCtrl',
        templateUrl: 'views/modal-tags.html'
      });
    };

    /**
     * Opens help aside
     */  
    self.showHelp = function () {
      var asideInstance = $aside.open({
        templateUrl: 'views/nav-help.html',
        placement: 'left',
        size: 'sm'
      });
    };
  }
]);

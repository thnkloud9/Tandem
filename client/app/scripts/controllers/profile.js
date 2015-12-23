'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('ProfileCtrl', [
  '$q',
  '$upload',
  '$routeParams',
  '$modal',
  'toaster',
  'config',
  'User',
  'Question',
  'session',
   function ($q, $upload, $routeParams, $modal, toaster, config, User, Question, session) {
    var self = this;

    self.isAdmin = (session.roles === "admin"); 
    self.speaksCode = session.speaks;
    self.learningCode = session.learning;
    self.speaksText = session.speaksText; 
    self.learningText = session.learningText;
    self.editMode = false;

    // load user from session
    User.get(session.userId).then(function (user) {
      self.user = user;
      self.isCurrentUser = true;
    });

    // get lst of all questions
    Question.getList({"max_results": 99999}).then(function (questions) {
      self.questionsTotal = questions.length;
    });

    self.updateProfileImage = function (files) {
      var file = files[0];
      var user = self.user;

      self.user.updateImage(file).then(function (user) {
        self.user = user;
      });
    };

    self.saveProfile = function () {
      var userData = {};
      userData.learning = self.user.learning; 
      userData.speaks = self.user.speaks; 
      userData.mobile = self.user.mobile;
      userData.email = self.user.email;
      userData.city = self.user.city;
      userData.country = self.user.country;

      User.one(self.user._id).patch(userData).then(function () {
        session.updateIdentity(self.user);
        self.editMode = false;
        toaster.pop('success', "Profile Updated", "It may take a few moments to update everywhere on the site.");
      }, function(response) {
        toaster.pop('error', "Server Problem", "There was a server problem.  Please try again in a few moments.");
      });
    };

    self.showMyResponses = function () {
      $modal.open({
        controller: 'ModalMyResponsesCtrl',
        controllerAs: 'modalMyResponsesCtrl',
        templateUrl: 'views/modal-my-responses.html'
      });
    };

  }
]);


'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:ModalMyResponsesCtrl
 * @description
 * # ModalMyResponsesCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('ModalMyResponsesCtrl', [
  '$q',
  '$aside',
  'config',
  'User',
  'session',
  function ($q, $aside, config, User, session) {
    var self = this;

    self.responses = [];
    self.maxResults = 8;
    self.page = 1;

    User.get(session.userId).then(function (user) {
      self.user = user;
      user.getResponses(self.maxResults, self.page).then(function (responses) {
        self.responses = responses;
      });
    });

    self.loadMoreResponses = function () {
      if (self.page !== 'end') {
        self.user.getResponses(self.maxResults, self.page).then(function (responses) {
          if (responses) {
            self.page++
            responses.forEach(function (response) {
              self.responses.push(response);
            });
          } else {
            self.page = 'end';
          }
        });
      } 
    };

    self.showComment = function (recording) {
      session.commentingRecording = recording;
      var asideInstance = $aside.open({
        templateUrl: 'views/aside-recording-comments.html',
        controller: 'CommentsCtrl',
        controllerAs: 'commentsCtrl',
        placement: 'right',
        size: 'sm'
      });
    };
  }
]);
   

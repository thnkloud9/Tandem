'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:ModalMyCommentsCtrl
 * @description
 * # ModalMyCommentsCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('ModalMyCommentsCtrl', [
  '$q',
  '$aside',
  'config',
  'User',
  'session',
  function ($q, $aside, config, User, session) {
    var self = this;
    
    self.rootRecordingUrl = config.API.rootURI + '/assets/audio/';
    self.comments = [];
    User.get(session.userId).then(function (user) {
      user.getComments().then(function (comments) {
        self.comments = comments;
      });
    });

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
   

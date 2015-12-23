'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:CommentsCtrl
 * @description
 * # CommentsCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('CommentsCtrl', [
  '$scope',
  'toaster',
  'config',
  'Recording',
  'Comment',
  'session',
   function (
    $scope,
    toaster, 
    config, 
    Recording,
    Comment,
    session) {
    var self = this;
    
    self.comments = [];
    self.recording = null;
    self.showAdd = false;
 
    $scope.$watch(angular.bind(session, function () {
      return session.commentingRecording;
    }), function (newVal, oldVal) {
      if (typeof newVal.createBlob === 'function') {
        self.recording = newVal;
        var blob = self.recording.createBlob();
        var url = URL.createObjectURL(blob);
        self.recordingUrl = url; 

        // load comments
        var params = {
          "where": {
            "parent": newVal._id
          }
        }
        Comment.getList(params).then(function (comments) {
          self.comments = comments;
        });
      } else {
        if (newVal) {
          var recordingId = (newVal._id) ? newVal._id : newVal;
          Recording.get(recordingId).then(function (recording) {
            self.recording = recording;
            var blob = recording.createBlob();
            var url = URL.createObjectURL(blob);
            self.recordingUrl = url; 

            // load comments
            var params = {
              "where": {
                "parent": recording._id
              }
            }
            Comment.getList(params).then(function (comments) {
              self.comments = comments;
            });
          }); 
        }
      }
    });

    self.saveComment = function () {
      var newComment = {
        "submitted_by": session.userId,
        "username": session.username,
        "affected_user": self.recording.submitted_by._id,
        "context": self.recording.context,
        "language_code": self.recording.language_code,
        "parent": self.recording._id,
        "text": self.userComment
      }

      Comment.post(newComment).then(function (response) {
        Comment.get(response._id).then(function (comment) {
          self.comments.push(comment);
          self.userComment = null;
        });
        toaster.pop('success', 'Comment Saved', 'Thanks!');
      }, function (response) {
        toaster.pop('error', 'Server Error', 'Please try again in a moment.');
      });
    };

  }
]);


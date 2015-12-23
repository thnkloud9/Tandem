'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('UsersCtrl', [
  '$q',
  '$routeParams',
  'config',
  'User',
  'Question',
  'Activity',
  'session',
   function ($q, $routeParams, config, User, Question, Activity, session) {
    var self = this;

    self.userActivities = [];
    self.leaders = [];

    self.userId = $routeParams.userId;
    if (self.userId === session.userId) {
      self.isCurrentUser = true;
    } else {
      self.isCurrentUser = false;
    }

    var params = {
      "sort": "-points",
      "max_results": 10
    }
    User.getList(params).then(function (users) {
      self.leaders = users;
    });

    var params = {
      "sort": "-_created",
      "where": {
        "submitted_by": self.userId,
      },
      "max_results": 10
    }
    Activity.getList(params).then(function (activities) {
      self.userActivities = activities;
    });

    // load user from session
    User.initUserStats(self.userId).then(function (user) {
      self.user = user;
      self.speaksFlagClass = (user.speaks[0] === 'en') ? 'flag-icon flag-icon-gb ' : 'flag-icon flag-icon-' + user.speaks[0]; 
      self.learningFlagClass = (user.learning[0] === 'en') ? 'flag-icon flag-icon-gb ' : 'flag-icon flag-icon-' + user.learning[0]; 
    });

    // get lst of all questions
    Question.getList({"max_results": 99999}).then(function (questions) {
      self.questionsTotal = questions.length;
    });

  }
]);


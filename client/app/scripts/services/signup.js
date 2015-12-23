'use strict';

/**
* A factory which creates a question model.
*
* @class Topic
*/
angular.module('tandemWebApp')
  .factory('Signup', [
    '$q',
    '$http',
    'PracticeSet',
    'Question',
    'config',
    'session',
    'toaster',
    function ($q, $http, PracticeSet, Question, config, session, toaster) {
      var Signup = function () {};

      Signup.createUser = function (signupForm) {
        var deferedPost = $q.defer();

        var newUser = {
          "username": signupForm.username,
          "password": signupForm.password,
          "email": signupForm.email,
          "speaks": [ signupForm.speaks ],
          "learning": [ signupForm.learning ],
          "roles": [ "user" ]
        };
        var request = {
          method: 'POST',
          url: config.API.full + '/users',
          headers: {
            'Content-Type': 'application/json'
          },
          data: newUser,
        } 
        
        $http(request)
        .success(function(response) {
          var userId = response._id;
          // login
          session.newTokenByLogin(signupForm.username, signupForm.password).then(function () {
            deferedPost.resolve(userId);
          });
        })
        .error(function(response) {
          console.log('ERROR ' + response);
          deferedPost.reject(response);
          toaster.pop('error', 'There was a problem with your signup');
        });

        return deferedPost.promise;
      };
 
      Signup.createDefaultPracticeSet = function () {
        var deferedPost = $q.defer();
        var params = {
          "where": JSON.stringify({ "tags": "introduction" })
        }

        Question.getList(params).then(function (questions) {
          var questionIds = _.pluck(questions, '_id');

          // add the default introudction practice set with questio ids
          var newPracticeSet = {
            title: 'Introduction', // TODO: translate this
            questions: questionIds,
            submitted_by: session.userId
          }
          PracticeSet.post(newPracticeSet).then(function (practiceSet) {
            deferedPost.resolve(practiceSet);
          });
        });

        return deferedPost.promise;
      };
 
      return Signup;
    }
]);

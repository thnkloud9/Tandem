'use strict';

/**
* A factory which creates a user model.
*
* @class Topic
*/
angular.module('tandemWebApp')
  .factory('User', [
    '$http',
    '$q',
    'toaster',
    'Restangular',
    'Recording',
    'PracticeSession',
    'PracticeSet',
    'Comment',
    'config',
    'session',
    function (
      $http,
      $q,
      toaster,
      Restangular,
      Recording,
      PracticeSession,
      PracticeSet,
      Comment,
      config,
      session) {
      var User = Restangular.all('users');
    
      // extend model
      Restangular.extendModel('users', function(model) {

        model.getRecording = function (maxResults, page) {
          var deferedGet = $q.defer();
          var filter = {
            "submitted_by": model._id
          }
          var params = {
            "where": filter
          }
          if (maxResults) {
            params.max_results = maxResults;
          }
          if (page) {
            params.page = page;
          }
          Recording.getList(params).then(function (audio) {
            model.audio = audio;
            deferedGet.resolve(audio); 
          });
          return deferedGet.promise;
        };

        model.getPracticeSessions = function (maxResults, page) {
          var deferedGet = $q.defer();
          var filter = {
            "submitted_by": model._id
          }
          var params = {
            "where": filter
          }
          if (maxResults) {
            params.max_results = maxResults;
          }
          if (page) {
            params.page = page;
          }
          PracticeSession.getList(params).then(function (practiceSessions) {
            model.practiceSessions = practiceSessions;
            deferedGet.resolve(practiceSessions); 
          });
          return deferedGet.promise;
        };

        model.getComments = function (maxResults, page) {
          var deferedGet = $q.defer();
          var filter = {
            "affected_user": model._id
          }
          var params = {
            "where": filter
          }
          if (maxResults) {
            params.max_results = maxResults;
          }
          if (page) {
            params.page = page;
          }
          Comment.getList(params).then(function (comments) {
            model.comments = comments;
            deferedGet.resolve(comments); 
          });
          return deferedGet.promise;
        };

        model.getPracticeSets = function (maxResults, page) {
          var deferedGet = $q.defer();
          var filter = {
            "submitted_by": model._id
          }
          var params = {
            "where": filter
          }
          if (maxResults) {
            params.max_results = maxResults;
          }
          if (page) {
            params.page = page;
          }
          PracticeSet.getList(params).then(function (practiceSets) {
            model.practiceSets = practiceSets;
            deferedGet.resolve(practiceSets); 
          });
          return deferedGet.promise;
        };

        model.getResponses = function (maxResults, page) {
          var deferedGet = $q.defer();
          var filter = {};
          var params = {};
            
          if (maxResults) {
            params.max_results = maxResults;
          }
          if (page) {
            params.page = page;
          }
          // get all practice sessions with question qudio from this user 
          filter = { 
            "context": "answer",
            "affected_user": model._id
          }
          params.where = filter;
          params.embedded = { "parent_audio": 1 }
          params.sort = "-_created";
          Recording.getList(params).then(function (allAnswers) {
            model.responses = allAnswers;
            deferedGet.resolve(allAnswers);
          });
  
          return deferedGet.promise;
        };

        model.updateImage = function (file) {
          var deferedPost = $q.defer();
          var request = {
            method: 'PATCH',
            url: config.API.full + '/users/' + model._id,
            headers: {
              'If-Match': model._etag,
              'Content-Type': undefined
            },
            transformRequest: function(data) { 
              var payload = new FormData();
              payload.append('image', file);
              return payload; 
            },
            data: {
              image: file
            }
          };

          $http(request)
          .then(function (response) {
            var resourceId = response.data._id;
            var request = {
              method: 'GET',
              url: config.API.full + '/users/'+resourceId,
              headers: {
                'Content-Type': 'application/json'
              }
            };
            return $http(request);  // retrieve update user 
          }, $q.reject)
          .then(function (response) {
            User.get(response.data._id).then(function (user) {
              deferedPost.resolve(user);
              toaster.pop('success', 'Image Updated', 'You may have to refresh the browser to see the update.');
            });
          }, function () {
            deferedPost.reject();
            toaster.pop('error', 'Server Error', 'Please try again in a few moments.');
          });

          return deferedPost.promise;
        };

        model.checkProfile = function () {
          var profileSteps = 1;
          model.missing = [];

          if (model.image) {
            profileSteps += 1;
          } else {
            model.missing.push(' a Profile Image');
          }

          if (model.city && model.country) {
            profileSteps += 1;
          } else {
            model.missing.push('your Location');
          }

          if (model.mobile) {
            profileSteps += 1;
          } else {
            model.missing.push('your Mobile');
          }

          if (profileSteps === 4) {
            model.profileStatus = "success";
          } else {
            model.profileStatus = "warning";
          }

          model.percentComplete = ((profileSteps / 4) * 100);
        };

        return model;
      });

      // can take a user object or user._id
      User.initUserStats = function (user) {
        var deferedGet = $q.defer();
        var profileUser = null;
        
        if (typeof user === 'object') {
          profileUser = user._id;
        } else {
          profileUser = user;
        }


        User.get(profileUser).then(function (user) {
          // get extra restangular model functions
          profileUser = user;
        }, $q.reject).then(function () {
          // get audio
          var params = { "where": { "submitted_by": profileUser._id }, "max_results": 1 }   
          Restangular.all('audio').getList(params).then(function (audios) {
            profileUser.totalRecording = audios._meta.total;
          });
        }, $q.reject).then(function () {
          // get questions
          var params = { "where": { "submitted_by": profileUser._id, "context": "question" }, "max_results": 1 }   
          Restangular.all('audio').getList(params).then(function (audios) {
            profileUser.totalQuestions = audios._meta.total;
          });
        }, $q.reject).then(function () {
          // get answers
          var params = { "where": { "submitted_by": profileUser._id, "context": "answer" }, "max_results": 1 }   
          Restangular.all('audio').getList(params).then(function (audios) {
            profileUser.totalAnswers = audios._meta.total;
          });
        }, $q.reject).then(function () {
          // get practice sessions
          var params = { "where": { "submitted_by": profileUser._id }, "max_results": 1 }   
          Restangular.all('practice_sessions').getList(params).then(function (practiceSessions) {
            profileUser.totalPracticeSessions = practiceSessions._meta.total;
          });
        }, $q.reject).then(function () {
          // get comments
          var params = { "where": { "affected_user": profileUser._id }, "max_results": 1 }   
          Restangular.all('comments').getList(params).then(function (comments) {
            profileUser.totalComments = comments._meta.total;
          });
        }, $q.reject).then(function () {
          // get practice sets
          var params = { "where": { "submitted_by": profileUser._id }, "max_results": 1 }   
          Restangular.all('practice_sets').getList(params).then(function (practiceSets) {
            profileUser.totalPracticeSets = practiceSets._meta.total;
          });
        }, $q.reject).then(function () {
          // get responsess
          var params = { "where": { "affected_user": profileUser._id, "context": "answer" }, "max_results": 1 }   
          Restangular.all('audio').getList(params).then(function (responses) {
            profileUser.totalResponses = responses._meta.total;
          });
        }, $q.reject).then(function () {
          // get ratings
          var params = { "where": { "affected_user": profileUser._id }, "max_results": 1 }   
          Restangular.all('ratings').getList(params).then(function (ratings) {
            profileUser.totalRatings = ratings._meta.total;
          });
        }, $q.reject).then(function () {
          // calculate understandable rating
          var params = { "where": { "affected_user": profileUser._id, "rating": {"$gte": 3 }}, "max_results": 1 }   
          Restangular.all('ratings').getList(params).then(function (ratings) {
            var percent = Math.round((ratings._meta.total / profileUser.totalRatings) * 100);
            profileUser.understandable = (isNaN(percent)) ? 0 : percent; 
          });
        }, $q.reject).then(function () {
          // mark as initialized
          // so we don't have to repeat
          profileUser.initialized = true;
          deferedGet.resolve(profileUser);
        });
        return deferedGet.promise;
      };

      return User;
    }

]);

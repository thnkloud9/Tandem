'use strict';

/* authentication and user function. */
angular.module('tandemWebApp').service('session', [ 
  '$q', 
  '$http', 
  '$window', 
  '$location',
  'toaster',
  'config',
  function($q, $http, $window, $location, toaster, config) {

  var self = this;

  self.init = function () {
    self.token = $window.sessionStorage.getItem('token');
    self.isAuthenticated = !!$window.sessionStorage.getItem('token');
    self.userId = $window.sessionStorage.getItem('user_id');
    self.username = ($window.sessionStorage.getItem('username')) ? 
      $window.sessionStorage.getItem('username'): null;
    self.roles = $window.sessionStorage.getItem('roles');
    self.speaks = $window.sessionStorage.getItem('speaks');
    self.learning = $window.sessionStorage.getItem('learning');
    self.speaksText = $window.sessionStorage.getItem('speaksText');
    self.learningText = $window.sessionStorage.getItem('learningText');
    self.profileImage = $window.sessionStorage.getItem('profile_image');

    // this will actually get populated by the user-pin 
    // directive (its a bit of a hack)
    self.user = $window.sessionStorage.getItem('user_id');
  };

  self.init();

  self.newTokenByLogin = function(username, password) {
    var deferredPost = $q.defer();
    var request = {
      method: 'POST',
      url: config.API.rootURI + '/login',
      headers: {
        'Content-Type': 'application/json' 
      },
      data: {
        "username": username,
        "password": password
      }
    };

    $http(request)
    .success(function (response) {
        if (response.status) {
            self.setIdentity(response).then(function () {
              deferredPost.resolve();
            });
        } else {
            toaster.pop('warning', "Could not login", "Your username or password is not correct.");
            self.clear();
            deferredPost.reject(response);
        }
    }).error(function (responseBody) {
        self.clear();
        toaster.pop('error', "Server Problem", "There was a server problem during login.  Please try again in a few moments.");
        deferredPost.reject(responseBody);
    }); 

    return deferredPost.promise; 
  };

  self.setIdentity = function (response) {
    var deferedGet = $q.defer(); 
    var session = response;
    $window.sessionStorage.setItem('token', session.token);
    $window.sessionStorage.setItem('user_id', session.user);
    $window.sessionStorage.setItem('username', session.username);
    $window.sessionStorage.setItem('roles', session.roles[0]);
    $window.sessionStorage.setItem('speaks', session.speaks[0]);
    $window.sessionStorage.setItem('learning', session.learning[0]);
    config.languages.forEach(function (language) {
      if (language.code === session.speaks[0]) {
        $window.sessionStorage.setItem('speaksText', language.text.translations[session.speaks[0]]);
      }
      if (language.code === session.learning[0]) {
        $window.sessionStorage.setItem('learningText', language.text.translations[session.speaks[0]]);
      }
    });

    // needed to get the profile image (cannot use User here
    // due to circular dependency on session)
    var request = {
      method: 'GET',
      url: config.API.full + '/users/' + session.user,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(session.token + ':')
      }
    };
    $http(request)
    .success(function (response) {
      $window.sessionStorage.setItem('profile_image', response.image);
      self.init();
      deferedGet.resolve();
    })
    .error(function (response) {
        toaster.pop('error', "Server Problem", "There was a server problem.  Please try again in a few moments.");
      deferedGet.reject(response);
    });

    return deferedGet.promise;
  };

  this.updateIdentity = function (userData) {
    var sessionData = userData;
    sessionData.user = self.userId;
    sessionData.token = self.token;
    self.setIdentity(sessionData);
  };

  this.clear = function() {
    var deferredPost = $q.defer();
    var request = {
      method: 'POST',
      url: config.API.rootURI + '/logout',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "username": self.username
      }
    };

    $http(request)
    .success(function (response) {
      $window.sessionStorage.removeItem('token');
      $window.sessionStorage.removeItem('username');
      $window.sessionStorage.removeItem('user_id');
      $window.sessionStorage.removeItem('roles');
      $window.sessionStorage.removeItem('speaks');
      $window.sessionStorage.removeItem('learning');
      $window.sessionStorage.removeItem('learningText');
      $window.sessionStorage.removeItem('speaksText');
      $window.sessionStorage.removeItem('profile_image');

      self.token = null; 
      self.isAuthenticated = false; 
      self.username = null; 
  
      $location.path( "/" );

      deferredPost.resolve();
    }).error(function (responseBody) {
        toaster.pop('error', "Server Problem", "There was a server problem.  Please try again in a few moments.");
        deferredPost.reject(responseBody);
    }); 

    return deferredPost.promise; 
  };

  }]);

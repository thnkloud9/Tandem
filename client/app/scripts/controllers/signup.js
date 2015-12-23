'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('SignupCtrl', [
  '$http',
  '$location',
  'Signup',
  'config',
  'session',
  'toaster',
  function ($http, $location, Signup, config, session, toaster) {
    var self = this;

    self.userAgreed = false;

    self.submitSignupForm = function(isValid) {
      if (isValid && self.userAgreed) {
        // create the new user and sign them in
        Signup.createUser(self.signupForm).then(function (userId) {
          // create the default practice set
          Signup.createDefaultPracticeSet().then(function () {
            toaster.pop('success', "Thanks for signing up", "Start speaking now by playing your Introduction Practice set");
            $location.path('/main') 
          });
        }); 
      } else {
        toaster.pop('error', 'Please agree to our terms and conditions');
      }
    };

  }
]);

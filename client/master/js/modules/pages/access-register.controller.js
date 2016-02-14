/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.pages').controller('RegisterFormController', [
    '$http',
    '$state',
    'APP_CONFIG',
    'Signup',
    function RegisterFormController($http, $state, APP_CONFIG, Signup) {
        var self = this;

        activate();

        ////////////////

        function activate() {
          // bind here all data from the form
          self.account = {};
          // place the message if something goes wrong
          self.authMsg = '';
            
          self.register = function() {
            self.authMsg = '';

            if(self.registerForm.$valid) {
              var newUser = {
                username: self.account.email,
                password: self.register.password,
                email: self.account.email,
                speaks: self.register.speaks,
                learning: self.register.learning 
              };
            
              Signup.createUser(newUser).then(function (userId) {
                // create the default practice set
                Signup.createDefaultPracticeSet(self.register.speaks).then(function () {
                  $state.go('app.dashboard');
                });
              }, function() {
                self.authMsg = 'Server Request Error';
              });
            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              self.registerForm.account_email.$dirty = true;
              self.registerForm.account_password.$dirty = true;
              self.registerForm.account_agreed.$dirty = true;
              
            }
          };
        }
    }]);
})();

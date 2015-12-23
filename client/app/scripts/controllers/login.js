'use strict';                                                                                            
                                                                                                         
angular.module('tandemWebApp')                                                                 
  .controller('LoginCtrl', [
    'session',
    function (session) {
    var self = this;

    self.username = '';                                                                                
    self.password = '';
    self.messages = {};

    self.login = function() {
      session.newTokenByLogin(self.username, self.password).then(function() {
        // TODO: test if the session is loaded
        console.log('Login Successful');
      });
    };

    self.submitFacebook = function() {
      console.log('submit facebook');
    };

    self.submitTwitter = function() {
      console.log('submit twitter');
    };
  }
]);

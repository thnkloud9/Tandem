/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller(
            'LoginFormController',
            ['$http', '$state', 'session', 'User',
                function LoginFormController($http, $state, session, User) {
                    var self = this;

                    activate();

                    ////////////////

                    function activate() {
                      // bind here all data from the form
                      self.account = {
                        email: (self.loginForm) ? self.loginForm.account_email.$modelValue : null,
                        password: (self.loginForm) ? self.loginForm.account_password.$modelValue : null
                      };
                      // place the message if something goes wrong
                      self.authMsg = '';

                      self.login = function() {
                        self.authMsg = '';
 
                        if(self.loginForm.$valid) {
                             
                          session.newTokenByLogin(self.account.email, self.account.password)
                            .then(function(response) {
                              // assumes if ok, response will have a token, if not, a string with error
                              if ( !response.token ) {
                                self.authMsg = 'Incorrect credentials.';
                              }else{
                                $state.go('app.dashboard');
                              }
                            }, function() {
                              self.authMsg = 'Server Request Error';
                            });
                        }
                        else {
                          // set as dirty if the user click directly to login so we show the validation messages
                          /*jshint -W106*/
                          self.loginForm.account_email.$dirty = true;
                          self.loginForm.account_password.$dirty = true;
                        }
                      };
                    }
                }
            ]
        );
})();

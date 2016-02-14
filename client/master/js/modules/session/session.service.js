(function() {
    'use strict';

    angular.module('app.session').service('session', [
        '$localStorage',
        '$rootScope',
        '$q',
        '$http',
        '$window',
        '$location',
        'APP_CONFIG',
        'User',
        function (
            $localStorage,
            $rootScope,
            $q,
            $http,
            $window,
            $location,
            APP_CONFIG,
            User) {
            var self = this;

            self.fields = {
                'token': null,
                'isAuthenticated': null, 
                'userId': null, 
                'username': null, 
                'roles': null, 
                'speaks': null, 
                'learning': null, 
                'speaksText': null, 
                'learningText': null, 
                'profileImage': null, 
                'user': null
            };

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
                self.picture = $window.sessionStorage.getItem('picture');
                self.name = $window.sessionStorage.getItem('name');
                if (!self.user && self.token) {
                    // get the user from the server
                    User.initUser(self.userId).then(function (user) {

                        console.log('re-initializing session user');

                        self.setLocaleLanguages(user);
                        // now set values we got from User model
                        $window.sessionStorage.setItem('profile_image', user.image);
                        $window.sessionStorage.setItem('picture', 'data:image/png;base64,' + user.image);
                        $window.sessionStorage.setItem('name', user.first_name);
                        self.user = user;

                        // now save ALL values to this object 
                        self.init();
                        
                        return true;
                    }, function (response) {
                        return false;
                    });
                }

                $rootScope.session = self;

                return true; 
            };

            self.init();

            self.newTokenByLogin = function(username, password) {
                var deferredPost = $q.defer();
                var request = {
                    method: 'POST',
                    url: APP_CONFIG.API.rootURI + '/login',
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
                        self.setSessionStorage(response).then(function () {
                            deferredPost.resolve(response);
                        });
                    } else {
                        self.clear();
                        deferredPost.reject(response);
                    }
                }).error(function (responseBody) {
                    self.clear();
                    deferredPost.reject(responseBody);
                }); 

                return deferredPost.promise; 
            };

            self.setLocaleLanguages = function (session) {
                // TODO: this doesnt work for some reason
                // I get no value from localStorae, even though I
                // can plainly see it in my browser
                var locale = ($localStorage['NG_TRANSLATE_LANG_KEY']) ?
                    $localStorage['NG_TRANSLATE_LANG_KEY'].substring(0,2) : session.speaks[0];
                var spath = APP_CONFIG.languages.filter(function(l) {
                    return l.code === session.speaks[0] 
                });
                var lpath = APP_CONFIG.languages.filter(function(l) {
                    return l.code === session.learning[0] 
                });
                var speaks = spath[0].text.translations;
                var learning = lpath[0].text.translations;

                // use locale set by app instead of speaks
                var speaksText = speaks[locale];
                var learningText = learning[locale];

                $window.sessionStorage.setItem('speaksText', speaksText);
                $window.sessionStorage.setItem('learningText', learningText);
            }

            self.setSessionStorage = function (session) {
                var deferedGet = $q.defer(); 
                // first set values we get directly from server session
                $window.sessionStorage.setItem('token', btoa(session.token + ':'));
                $window.sessionStorage.setItem('user_id', session.user);
                $window.sessionStorage.setItem('username', session.username);
                $window.sessionStorage.setItem('roles', session.roles[0]);
                $window.sessionStorage.setItem('speaks', session.speaks[0]);
                $window.sessionStorage.setItem('learning', session.learning[0]);
                
                // now set text string language based on app locale
                self.setLocaleLanguages(session);

                // now set these so that our api calls will be
                // authenticated by authInterceptor
                self.token = $window.sessionStorage.getItem('token');
                self.userId = $window.sessionStorage.getItem('user_id');

                User.initUser(self.userId).then(function (user) {
                    // now set values we got from User model
                    $window.sessionStorage.setItem('profile_image', user.image);
                    $window.sessionStorage.setItem('name', user.first_name);
                    self.user = user;
                    // now save ALL values to this object 
                    self.init();
                    deferedGet.resolve(user);
                }, function (response) {
                    deferedGet.reject(response);
                });

                return deferedGet.promise;
            };
 
            // used is various parts of the app 
            // when a logged in user updates profile
            // data, this just updates the sessionStore values
            // with latest data from the server 
            this.updateIdentity = function () {
              var deferedGet = $q.defer(); 

              // call User.initUser, then self.init()
              User.initUser(self.userId).then(function (user) {
                  // now set values we got from User model
                  $window.sessionStorage.setItem('profile_image', user.image);
                  $window.sessionStorage.setItem('roles', user.roles[0]);
                  $window.sessionStorage.setItem('speaks', user.speaks[0]);
                  $window.sessionStorage.setItem('learning', user.learning[0]);
                  APP_CONFIG.languages.forEach(function (language) {
                    if (language.code === user.speaks[0]) {
                        $window.sessionStorage.setItem('speaksText', language.text.translations[user.speaks[0]]);
                    }
                    if (language.code === user.learning[0]) {
                        $window.sessionStorage.setItem('learningText', language.text.translations[user.speaks[0]]);
                    }
                  });
                  self.user = user;
                  // now save ALL values to this object 
                  self.init();
                  deferedGet.resolve(user);
              }, function (response) {
                  deferedGet.reject(response);
              });

              return deferedGet.promise;
            };

            // Used when a logged in user updates their image
            self.updateImage = function (image) {
                $window.sessionStorage.setItem('profile_image', image);
                self.profileImage = $window.sessionStorage.getItem('profile_image');
            };

            /**
             * Used to logout
             * makes call to the api to clear the server session
             * clears out sessionStorage, and this objects vars
             */
            self.clear = function() {
                var deferredPost = $q.defer();
                var request = {
                  method: 'POST',
                  url: APP_CONFIG.API.rootURI + '/logout',
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
                    self.userId = null;
                    self.user = null;
                    self.profileImage = null;
                    self.roles = null;
                    self.speaks = null;
                    self.learning = null;
                    self.speaksText = null;
                    self.learningText = null;
              
                    $location.path( "/" );

                    deferredPost.resolve();
                }).error(function (responseBody) {
                    deferredPost.reject(responseBody);
                }); 

                return deferredPost.promise; 
            };

        }
            ]
        );
})();

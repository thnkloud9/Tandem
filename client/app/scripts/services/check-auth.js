'use strict';

angular.module('tandemWebApp').factory(
  'checkAuth', 
  function($rootScope, $location, session) {
    function checkAuth() {

      var publicRoutes = [
        '/main',
        '/about',
        '/signup',
        '/contact',
      ];

      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var nextRoute = next.split('#');
        if ((publicRoutes.indexOf(nextRoute[1]) === -1 ) &&
            (!session.isAuthenticated)) {
          event.preventDefault;
          $location.path("/");
        }
      });

      // populate current user
      $rootScope.$watch(
        function() { 
            return session.token; 
        }, 
        function () { 
            if (session.isAuthenticated) {
                $rootScope.currentUser = session.username;
                $rootScope.isAuthenticated = true; 
            } else {
                $rootScope.currentUser = null;
                $rootScope.isAuthenticated = false; 
            }
        }
      );

    }

    return checkAuth;

  });

(function() {
    'use strict';

    angular
        .module('app.checkauth')
        .factory(
            'checkauth',
            ['$rootScope', '$location', 'session', 
                function ($rootScope, $location, session) {
                    function checkAuth() {
                        var publicRoutes = [
                            '/page/login',
                            '/page/register',
                            '/page/recover',
                            '/page/lock',
                            '/page/404',
                        ];

                        $rootScope.$on('$locationChangeStart', function (event, next, current) {
                            var nextRoute = next.split('#');
                            if ((publicRoutes.indexOf(nextRoute[1]) === -1 ) &&
                                (!session.isAuthenticated)) {
                                event.preventDefault;
                                $location.path("/page/login");
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
                }
            ]
        );
})();

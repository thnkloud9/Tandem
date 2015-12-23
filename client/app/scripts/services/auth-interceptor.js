'use strict';

/**
* AngularJS Service for intercepting API requests and adding authorization
* info to them.
*
* @class authInterceptor
*/
angular.module('tandemWebApp').factory('authInterceptor', [
    '$injector',
    '$q',
    function ($injector, $q) {
        // NOTE: session service is not injected directly, because it depends
        // on the $http service and the latter's provider uses this
        // authInterceptor service --> circular dependency.
        // We thus inject need to inject session service on the fly (when it
        // is actually needed).

        return {
            request: function (config) {
                var token,
                    session = $injector.get('session');

                // do not add auth to logout
                // TODO: make this regex and ignore host, just look for logout
                if (config.url === 'http://localhost:5000/logout') {
                    return config;
                }

                config.headers = config.headers || {};

                if (session.token) {
                    config.headers.Authorization = 'Basic ' + btoa(session.token + ':');
                    // TODO: remove this
                    console.log(btoa(session.token + ':'));
                }

                return config;
            },

            // If we receive an error response because authentication token
            // is invalid/expired, we handle it by displaying a login modal.
            //
            // If login succeeds and a new token is obtained, the failed http
            // request is transparently repeated with a correct token. If even
            // this retried request (recognized by a special marker flag in
            // request's http config) fails, the error is not further handled
            // and is passed to through to the other parts of the application.
            //
            // Other types of http errors are not handled here and are simply
            // passed through.
            responseError: function (response) {
                var configToRepeat,
                    failedRequestConfig,
                    retryDeferred,
                    session,
                    $http;

                session = $injector.get('session');

                if (response.config.IS_RETRY) {
                    // Tried to retry the initial failed request but failed
                    // again --> forward the error without another retry (to
                    // avoid a possible infinite loop).
                    return $q.reject(response);
                }

                if (response.status === 401) {
                    // Request failed due to invalid oAuth token - try to
                    // obtain a new token and then repeat the failed request.
                    failedRequestConfig = response.config;
                    retryDeferred = $q.defer();

                    /* TODO: implement this
                    session.newTokenByLoginModal()
                    .then(function () {
                        // new token successfully obtained, repeat the request
                        $http = $injector.get('$http');

                        configToRepeat = angular.copy(failedRequestConfig);
                        configToRepeat.IS_RETRY = true;

                        $http(configToRepeat)
                        .then(function (newResponse) {
                            delete newResponse.config.IS_RETRY;
                            retryDeferred.resolve(newResponse);
                        })
                        .catch(function () {
                            retryDeferred.reject(response);
                        });
                    })
                    .catch(function () {
                        // obtaining new token failed, reject the request
                        retryDeferred.reject(response);
                    });
                    */
                    console.log('unauthorized');
                    return retryDeferred.promise;
                } else {
                    // some non-authentication error occured, these kind of
                    // errors are not handled by this interceptor --> simply
                    // forward the error
                    return $q.reject(response);
                }
            }
        };
    }
]);

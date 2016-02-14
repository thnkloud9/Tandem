(function() {
    'use strict';

    /* audio recorder service. */
    angular.module('app.mymemory').service('mymemory', [ 
      '$q',
      '$http',
      '$localStorage',
      'APP_CONFIG',
      'session',
      function mymemory($q, $http, $localStorage, APP_CONFIG, session) {
        var self = this;

        self.translateText = function(text, from, to) {
          var deferedTranslate = $q.defer();
          var url = APP_CONFIG.mymemory.rootURI + 'get?q=' + text + '&langpair=';
          var cacheKey = 'mm-' + text + '-' + from + '-' + to;
          url += from + '|' + to;

          if ($localStorage[cacheKey]) {
            deferedTranslate.resolve($localStorage[cacheKey]);
          } else {
            // make call to translation service api
            $http({
              method: 'GET',
              url: url,
              headers: { 'Accept': 'application/json, text/plain, */*' }
            }).then(function (response) {
              if (!response.data.matches) {
                console.log('bad response from mymemory', response);
                deferedTranslate.reject();
              } else {
                // save to browser cache
                $localStorage[cacheKey] = response.data.matches;
                deferedTranslate.resolve(response.data.matches);
              }
            }, function (response) {
              deferedTranslate.reject();
            });
          }

          return deferedTranslate.promise;
        }; 
      }
    ]);
})();

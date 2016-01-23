(function() {
    'use strict';

    /* duolingo service. */
    angular.module('app.google').service('googleSearch', [ 
      '$q',
      '$http',
      '$localStorage',
      'APP_CONFIG',
      'session',
      function googleSearch($q, $http, $localStorage, APP_CONFIG, session) {
        var self = this;

        self.getSearchResults = function (text) {
          var deferedResults = $q.defer();
          var url = APP_CONFIG.gcse.apiURI + '?key=' + APP_CONFIG.gcse.apiKey + '&q=' + text;
          var cacheKey = 'gsearch-' + url;

          if ($localStorage[cacheKey]) {
            deferedResults.resolve($localStorage[cacheKey]);
          } else {
            $http({
              method: 'GET',
              url: url,
              headers: { 'Accept': 'application/json, text/plain, */*' }
            }).then(function (response) {
              if (!response.data.items) {
                deferedResults.reject();
              } else {
                $localStorage[cacheKey] = response.data.items; 
                deferedResults.resolve(response.data.items);
              }
            }, function (response) {
              deferedResults.reject();
            });
          }

          return deferedResults.promise;
        };

        // TODO: use fileType to limit search to only
        // png, jpg, and jpeg
        self.getImageResults = function (text) {
          var deferedResults = $q.defer();
          var imgType='photo';
          var imgSize='medium';
          var fileType='png';
          var url = APP_CONFIG.gcse.apiURI + '?key=' + APP_CONFIG.gcse.apiKey + '&q=' + text +
            '&searchType=image&imgType=' + imgType + '&imgSize=' + imgSize + '&fileType=' +
            fileType; // + '&rights=cc_publicdomain';
          var cacheKey = 'gsearch-' + url;

          if ($localStorage[cacheKey]) {
            deferedResults.resolve($localStorage[cacheKey]);
          } else {
            $http({
              method: 'GET',
              url: url,
              headers: { 'Accept': 'application/json, text/plain, */*' }
            }).then(function (response) {
              if (!response.data.items) {
                deferedResults.reject();
              } else {
                $localStorage[cacheKey] = response.data.items; 
                deferedResults.resolve(response.data.items);
              }
            }, function (response) {
              deferedResults.reject();
            });
          }

          return deferedResults.promise;
        };

      }
    ]);
})();

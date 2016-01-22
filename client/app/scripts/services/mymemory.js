'use strict';

/* audio recorder service. */
angular.module('tandemWebApp').service('mymemory', [ 
  '$q',
  '$http',
  'config',
  'session',
  function mymemory($q, $http, config, session) {
    var self = this;

    self.translateText = function(text, origin) {
      var deferedTranslate = $q.defer();
      var url = config.mymemory.rootURI + 'get?q=' + text + '&langpair=';

      if (origin === 'speaks') {
        url += session.speaks + '|' + session.learning;
      } else {
        url += session.learning + '|' + session.speaks;
      }

      // make call to translation service api
      $http({
        method: 'GET',
        url: url,
        headers: { 'Accept': 'application/json, text/plain, */*' }
      }).then(function (response) {
        deferedTranslate.resolve(response.data.matches);
      }, function (response) {
        deferedTranslate.reject();
      });

      return deferedTranslate.promise;
    }; 
  }
]);

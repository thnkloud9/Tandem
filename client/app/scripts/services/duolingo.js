'use strict';

/* duolingo service. */
angular.module('tandemWebApp').service('duolingo', [ 
  '$q',
  '$http',
  'config',
  'session',
  function duolingo($q, $http, config, session) {
    var self = this;

    self.getTextHints = function (text, origin) {
      var deferedHints = $q.defer();
      var url = config.duolingo.dictURI + 'hints/';

      if (origin === 'speaks') {
        url += session.speaks + '/' + session.learning;
      } else {
        url += session.learning + '/' + session.speaks;
      }
      url += '?sentence=' + text + '&callback=JSON_CALLBACK';

      $http({
        method: 'JSONP',
        url: url,
        transformRequest: function(data, headersGetter) {
          var headers = headersGetter();
          delete headers['Authorization'];
          return headers;
        }
      }).then(function (response) {
        deferedHints.resolve(response.data.tokens);
      }, function (response) {
        deferedHints.reject();
      });

      return deferedHints.promise;
    };
  }
]);

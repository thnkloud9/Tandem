(function() {
    'use strict';

    /* duolingo service. */
    angular.module('app.duolingo').service('duolingo', [ 
      '$q',
      '$http',
      '$localStorage',
      'APP_CONFIG',
      'session',
      function duolingo($q, $http, $localStorage, APP_CONFIG, session) {
        var self = this;

        self.getTextHints = function (text, from, to) {
          var deferedHints = $q.defer();
          var url = APP_CONFIG.duolingo.dictURI + 'hints/';
          var cacheKey = 'dl-' + text + '-' + from + '-' + to;

          url += from + '/' + to;
          url += '?sentence=' + text + '&callback=JSON_CALLBACK';

          // check local cache first
          if ($localStorage[cacheKey]) {
            deferedHints.resolve(self.parseHints($localStorage[cacheKey]));
          } else {
              // make the api call
              $http({
                method: 'JSONP',
                url: url,
                transformRequest: function(data, headersGetter) {
                  var headers = headersGetter();
                  delete headers['Authorization'];
                  return headers;
                }
              }).then(function (response) {
                if (!response.data.tokens) {
                  deferedHints.reject();
                } else {
                  // save to browser cache
                  $localStorage[cacheKey] = response;
                  deferedHints.resolve(self.parseHints(response));
                }
              }, function (response) {
                deferedHints.reject();
              });
          }

          return deferedHints.promise;
        };

        self.parseHints = function (hints) {
          var parsedHints = {};
          var oWords = 0;

          angular.forEach(hints.data.tokens, function(word) {
            var oWord = word.value;
            var table = (word.hint_table) ? word.hint_table : null;
            var totalRows = (word.hint_table) ? word.hint_table.rows.total : 0;

            if (table) {
              // do we have results for this word?
              var rows = (table.rows.length) ? table.rows : null;
              if (rows) {
                angular.forEach(rows, function(row) {
                  var cells = (row.cells.length) ? row.cells : null;
                  if (cells) {
                    var tWord = (cells[0]) ? cells[0].hint : null;
                    if (parsedHints[oWord]) {
                      parsedHints[oWord].push(tWord);
                    } else {    
                      parsedHints[oWord] = [];
                      parsedHints[oWord].push(tWord);
                    }
                  }
                });
              }
            }
          });

          return parsedHints;
        };
      }
    ]);
})();

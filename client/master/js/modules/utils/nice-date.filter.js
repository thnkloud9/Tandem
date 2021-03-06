(function() {
    'use strict';

    angular.module('app.utils').filter('niceDate', [
        '$filter',
        function ($filter) {
            return function (input) {
                var date;
                if (typeof input === 'string') {
                    date = new Date(Date.parse(input));
                } else {
                    date = input;
                }
                return $filter('date')(date, 'dd.MM.yyyy HH:mm');
            };
        }
    ]);
})();

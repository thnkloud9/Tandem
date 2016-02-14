(function() {
    'use strict';

    angular.module('app.search').controller('SearchFormController', [
      '$rootScope',
      '$state',
      'APP_CONFIG',
      'session',
      'Notify',
      function SearchFormController(
        $rootScope,
        $state,
        APP_CONFIG,
        session,
        Notify) {
      var vm = this;

      activate();

      function activate() {
        vm.go = function () {
          $rootScope.$broadcast('topNavSearch', { text: vm.searchText });
        }
      } // end activate
    }
  ]);
})();

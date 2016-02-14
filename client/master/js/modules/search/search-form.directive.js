(function() {
  'use strict';
  
  angular.module('app.search').directive('searchForm', function () {                             
    return {
      templateUrl: 'app/views/partials/search-form.html',
      restrict: 'E',
      controller: 'SearchFormController', 
      controllerAs: 'search', 
      bindToController: true,
      scope: {
        context: '@'
      },
      link: function (scope, element, attrs, controller) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                controller.go();
            }
        });
      }
    };      
  });
})();

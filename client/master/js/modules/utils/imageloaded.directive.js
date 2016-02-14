/**=========================================================
 * Module: imageloaded.js
 * Adds a class to an img file once src has been loaded
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.utils').directive('imageloaded', [

        function imageloaded () {
            // Copyright(c) 2013 André König <akoenig@posteo.de>
            // MIT Licensed
            var directive = {
                link: link,
                restrict: 'A'
            };
            return directive;

            function link(scope, element, attrs) {
              var cssClass = attrs.loadedclass;

              element.bind('load', function () {
                  angular.element(element).addClass(cssClass);
              });
            }
        }
    ]);
})();

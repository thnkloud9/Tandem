/**=========================================================
 * Module: image-with-upload.js
 * Adds a file input an activates upload dialog on img click
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.utils').directive('imageWithUpload', [

        function imageloaded () {
            var directive = {
                link: link,
                scope: {
                  imgSrc: '@',
                  fileOnChange: '@',
                  imgClass: '@',
                },
                template: "<img id='file-input-image' class='{{ imgClass }}' ' ng-src='{{ imgSrc }}'>" +
                  "<input id='file-input' style='display: none' file-on-change='{{ fileOnChange }}' type='file'>"
            };
            return directive;

            function link(scope, element, attrs) {

              element.find('#file-input-image').bind('click', function () {
                element.find('#file-input').click();
              });

            }
        }
    ]);
})();

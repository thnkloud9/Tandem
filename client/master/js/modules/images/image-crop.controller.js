/**=========================================================
 * Module: form-imgcrop.js
 * Image crop controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.images').controller('ImageCropController', [
      '$scope',
      '$uibModalInstance',
      function ImageCropController($scope, $uibModalInstance) {
        var self = this;

        activate();

        ////////////////

        function activate() {
          self.imageReset = function() {
            self.myImage        = '';
            self.myCroppedImage = '';
            self.imgcropType    = 'square';
          };

          self.imageReset();

          // called when image file is changed
          // via fileOnChange directive
          self.handleFileSelect=function(evt) {
console.log('here');
            var file=evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
              $scope.$apply(function(/*$scope*/){
                self.myImage=evt.target.result;
              });
            };
            if(file) {
              reader.readAsDataURL(file);
            }
          };
          
          //angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
        }
      }
    ]);
})();

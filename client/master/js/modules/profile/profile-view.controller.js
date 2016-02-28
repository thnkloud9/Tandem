(function() {
    'use strict';

    angular.module('app.profile').controller('ProfileViewController', [
      '$filter',
      '$scope',
      '$http',
      '$state',
      '$q',
      'toaster',
      'User',
      'session',
      'editableOptions',
      'editableThemes',
      'APP_CONFIG',
      'ngDialog',
      'Notify',
      'fileUtils',
      function ProfileViewController(
          $filter,
          $scope,
          $http,
          $state,
          $q,
          toaster,
          User,
          session,
          editableOptions,
          editableThemes,
          APP_CONFIG,
          ngDialog,
          Notify,
          fileUtils) {
            var vm = this;

            activate();

            ////////////////

            function activate() {

              // setup for xeditable fields
              editableOptions.theme = 'bs3';
              editableThemes.bs3.inputClass = 'input-sm';
              editableThemes.bs3.buttonsClass = 'btn-xs';
              editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-success">' +
                '<span class="fa fa-check"></span></button>';
              editableThemes.bs3.cancelTpl = '<button type="button" class="btn btn-default" ' +
                'ng-click="$form.$cancel()">'+
                '<span class="fa fa-times text-muted"></span>'+
                '</button>';

              vm.showUpdate = false;

              vm.user = {
                fullName: session.user.first_name + ' ' + session.user.last_name,
                introduction: session.user.introduction,
                email: session.user.username,
                mobile: session.user.mobile,
                gender: session.user.gender, 
                speaks: session.speaks,
                learning: session.learning,
                location: session.user.city + ', ' + session.user.country 
              };

              // populate language list from APP_CONFIG
              vm.languages = [];
              angular.forEach(APP_CONFIG.languages, function(l) {
                vm.languages.push({
                  code: l.code,
                  text: l.text.translations[session.speaks]
                });
              });

              // options for language select
              vm.showLearningLanguage = function() {
                var selected = $filter('filter')(vm.languages, {code: vm.user.learning});
                return (vm.user.learning && selected.length) ? selected[0].text : 'Not set';
              };

              // options for language select
              vm.showSpeaksLanguage = function() {
                var selected = $filter('filter')(vm.languages, {code: vm.user.speaks});
                return (vm.user.speaks && selected.length) ? selected[0].text : 'Not set';
              };

              // events array for timeline
              vm.timeline = User.initTimeline(session.user);

              // place the message if something goes wrong
              vm.authMsg = '';

              // image crop dialog setup
              vm.imageReset = function() {
                vm.myImage = '';
                vm.myCroppedImage = '';
                vm.imgcropType = 'square';
              };

              vm.imageReset();

              // called when image file is changed
              // via fileOnChange directive
              vm.handleFileSelect = function(evt) {
                var file=evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                  $scope.$apply(function(/*$scope*/){
                    vm.myImage = evt.target.result;
                  });
                };
                if(file) {
                  reader.readAsDataURL(file);
                }
              };
              
              /**
               * Opens image selection and crop dialog
               */
              vm.openImageCrop = function() {
                // TODO: move ImageCrop to its own controller
                // and probably own module app.image-crop
                // but Im having problems with the on-file-change not firing
                // with a spearate controller for some reason
                // both controllerAs and controller, not sure why
                ngDialog.openConfirm({
                  template: 'app/views/modals/image-crop.html',
                  className: 'ngdialog-theme-default ngdialog-theme-large',
                  scope: $scope
                })
                .then(function(value){
                  // make base64 string into a file
                  var blob = fileUtils.base64toBlob(vm.myCroppedImage);
                  // Perform the save here
                  session.user.updateImage(blob).then(function (user) {
                    // update session image
                    session.updateImage(vm.myCroppedImage.split(',')[1]); 
                    //Notify.alert('Profile image updated.', {status: 'success'});
                  }, function () {
                    Notify.alert('There was a problem updating your profile image.', {status: 'error'});
                  })
                }, function(value){
                    //Notify.alert('Profile image not updated.', {status: 'warning'});
                });
              };

              /**
               * Updates profile using profileForm
               */
              vm.update = function() {
                var data = {
                  speaks: [],
                  learning: []
                };
                data.first_name = vm.user.fullName.split(' ')[0];
                data.last_name  = vm.user.fullName.split(' ')[1];
                data.city = vm.user.location.split(' ')[0].replace(',','');
                data.country = vm.user.location.split(' ')[1];
                data.introduction = vm.user.introduction;
                data.speaks.push(vm.user.speaks); 
                data.learning.push(vm.user.learning); 

                User.one(session.user._id).patch(data).then(function (user) {
                    session.updateIdentity().then(function () {
                      Notify.alert("Profile Updated", {status: 'success'});
                      vm.showUpdate = false;
                    }, function () {
                      Notify.alert("There was a server problem. However, your changes have been saved.");
                    });
                }, function(response) {
                    Notify.alert("There was a server problem.  Please try again in a few moments.");
                });

              };


            } // end activate
        }
    ]);
})();

'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:UserPinCtrl
 * @description
 * # UserPinCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('UserPinCtrl', [
  '$scope',
  'User',
  'config',
  'session',
  function ($scope, User, config, session) {
    var self = this;

    if (!self.imageClass) {
      self.imageClass = "img-circle profile-img-sm";
    }

    if (!self.noImageClass) {
      self.noImageClass = "fa fa-2x fa-user user-pin-icon";
    }

    self.init = function () {
      if (typeof self.user === 'object') {
          self.hasImage = (self.user.image);
          self.imageUrl = config.API.rootURI + '/assets/profile_images/' + self.user._id;
      } else {
        if (self.user) {
          User.get(self.user).then(function (user) {
            self.user = user;
            self.hasImage = (user.image);
            self.imageUrl = config.API.rootURI + '/assets/profile_images/' + user._id;
          });
        }
      }
    };

    self.imageWatch = $scope.$watch(angular.bind(self, function() { 
      return self.user;
    }), function(newVal, oldVal) {
      if (newVal) {
        self.init();
      }
    });

  }
]);


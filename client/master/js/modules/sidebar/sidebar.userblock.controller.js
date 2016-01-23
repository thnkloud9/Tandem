(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('UserBlockController', UserBlockController);

    UserBlockController.$inject = ['$rootScope', '$scope', 'session'];
    function UserBlockController($rootScope, $scope, session) {

        activate();

        ////////////////

        function activate() {
          $rootScope.user = session.user;

          // watch for session updates (profile changes)
          $scope.$watch(angular.bind(session, function () {
            return session.profileImage;
          }), function (newImage, oldImage) {
            $rootScope.user.picture = 'data:image/png;base64,' + newImage;
          });

          // Hides/show user avatar on sidebar
          $rootScope.toggleUserBlock = function(){
            $rootScope.$broadcast('toggleUserBlock');
          };

          $rootScope.userBlockVisible = true;

          var detach = $rootScope.$on('toggleUserBlock', function(/*event, args*/) {

            $rootScope.userBlockVisible = ! $rootScope.userBlockVisible;

          });

          $scope.$on('$destroy', detach);

          $rootScope.logout = function () {
            session.clear(); 
          };
        }
    }
})();

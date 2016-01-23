(function() {
    'use strict';

    angular.module('app.dashboard').controller('DashboardController', [ 
        '$rootScope',
        '$scope',
        '$q',
        'User',
        'Recording',
        'PracticeSession',
        'PracticeSet',
        'Question',
        'Comment',
        'session',
        function DashboardController(
            $rootScope,
            $scope,
            $q,
            User,
            Recording,
            PracticeSession,
            PracticeSet,
            Question,
            Comment,
            session) {
            var self = this;

            activate();

            ////////////////

            function activate() {
            }

        }
    ]);
})();

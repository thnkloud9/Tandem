/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS
 * 
 * Version: 3.2.0
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 * 
 */

// APP START
// ----------------------------------- 

(function() {
    'use strict';

    angular
        .module('tandem', [
            'app.core',
            'app.session',
            'app.checkauth',
            'app.routes',
            'app.authInterceptor',
            'app.modalFactory',
            'app.audio',
            'app.images',
            'app.sidebar',
            'app.navsearch',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.admin',
            'app.dashboard',
            'app.notify',
            'app.charts',
            'app.panels',
            'app.locale',
            'app.maps',
            'app.pages',
            'app.tables',
            'app.utils',
            'app.models',
            'app.profile',
            'app.tags',
            'app.questions',
            'app.practiceSets',
            'app.mymemory',
            'app.duolingo',
            'app.google'
        ]);
})();


(function() {
    'use strict';

    angular
        .module('app.admin', []);
})();

(function() {
    'use strict';

    angular
        .module('app.audio', []);
})();

(function() {
    'use strict';

    angular
        .module('app.authInterceptor', []);
})();

(function() {
    'use strict';

    angular
        .module('app.charts', []);
})();
(function() {
    'use strict';

    angular
        .module('app.checkauth', []);
})();

(function() {
    'use strict';

    angular
        .module('app.colors', []);
})();
(function() {
    'use strict';

    angular
        .module('app.core', [
            'ngRoute',
            'ngAnimate',
            'ngStorage',
            'ngCookies',
            'pascalprecht.translate',
            'ui.bootstrap',
            'ui.router',
            'oc.lazyLoad',
            'cfp.loadingBar',
            'ngSanitize',
            'ngResource',
            'tmh.dynamicLocale',
            'restangular',
            'ngAudio',
            'ui.utils'
        ]);
})();

(function() {
    'use strict';

    angular
        .module('app.dashboard', []);
})();
(function() {
    'use strict';

    angular
        .module('app.duolingo', []);
})();

(function() {
    'use strict';

    angular
        .module('app.google', []);
})();

(function() {
    'use strict';

    angular
        .module('app.images', []);
})();

(function() {
    'use strict';

    angular
        .module('app.lazyload', []);
})();
(function() {
    'use strict';

    angular
        .module('app.loadingbar', []);
})();
(function() {
    'use strict';

    angular
        .module('app.locale', []);
})();
(function() {
    'use strict';

    angular
        .module('app.maps', []);
})();
(function() {
    'use strict';

    angular
        .module('app.modalFactory', []);
})();

(function() {
    'use strict';

    angular
        .module('app.models', []);
})();

(function() {
    'use strict';

    angular
        .module('app.mymemory', []);
})();

(function() {
    'use strict';

    angular
        .module('app.navsearch', []);
})();
(function() {
    'use strict';

    angular
        .module('app.notify', []);
})();
(function() {
    'use strict';

    angular
        .module('app.pages', []);
})();
(function() {
    'use strict';

    angular
        .module('app.panels', []);
})();
(function() {
    'use strict';

    angular
        .module('app.practiceSets', []);
})();

(function() {
    'use strict';

    angular
        .module('app.preloader', []);
})();


(function() {
    'use strict';

    angular
        .module('app.profile', []);
})();

(function() {
    'use strict';

    angular
        .module('app.questions', []);
})();

(function() {
    'use strict';

    angular
        .module('app.routes', [
            'app.lazyload'
        ]);
})();
(function() {
    'use strict';

    angular
        .module('app.session', []);
})();

(function() {
    'use strict';

    angular
        .module('app.settings', []);
})();
(function() {
    'use strict';

    angular
        .module('app.sidebar', []);
})();
(function() {
    'use strict';

    angular
        .module('app.tables', []);
})();
(function() {
    'use strict';

    angular
        .module('app.tags', []);
})();

(function() {
    'use strict';

    angular
        .module('app.translate', []);
})();
(function() {
    'use strict';

    angular
        .module('app.utils', [
          'app.colors'
          ]);
})();

/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('AudiosAdminController', [
      'Audio',
      function AudiosAdminController(
        Audio) {
          var self = this;

          activate();

          ////////////////

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 15},
              {headerName: 'context', field: 'context', width: 25},
              {headerName: 'languageCode', field: 'language_code', width: 25},
              {headerName: 'QuestionText', field: 'question_text', width: 25},
              {headerName: 'Audio', field: 'audio', width: 25},
              {headerName: 'SubmittedBy', field: 'submitted_by', width: 25},
              {headerName: 'Created', field: '_created', width: 25},
              {headerName: 'Updated', field: '_updated', width: 25}
            ];

            // set table options 
            self.gridOptions = {
                columnDefs: columnDefs,
                rowData: null,
                enableFilter: true,
                ready: function(api){
                  api.sizeColumnsToFit();
                }
            };

            // load data
            self.page = 1;
            self.maxResults = 30;
            self.audios = [];
            var params = {
              max_results: self.maxResults,
              page: self.page
            };
            Audio.getList(params).then(function (audios) {
              var fields = _.pluck(columnDefs, 'field');
              angular.forEach(audios, function (audio) {
                self.audios.push(_.pick(audio, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(audios);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addAudio = function () {
              self.audios.push(angular.copy(self.editingAudio));
            };

            self.editAudio = function(index) {
              self.audios.splice(index, 1, angular.copy(self.editingAudio));
            };

            self.removePerson = function(index) {
              self.audios.splice(index, 1);
            };

          } // activate END
      }
    ]);
})();

/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('CommentsAdminController', [
      'Comment',
      function CommentsAdminController(
        Comment) {
          var self = this;

          activate();

          ////////////////

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 15},
              {headerName: 'Context', field: 'context', width: 25},
              {headerName: 'LanguageCode', field: 'language_code', width: 25},
              {headerName: 'Comment', field: 'comment', width: 25},
              {headerName: 'AffectedUser', field: 'affected_user', width: 25},
              {headerName: 'Parent', field: 'parent', width: 25},
              {headerName: 'SubmittedBy', field: 'submitted_by', width: 25},
              {headerName: 'Created', field: '_created', width: 25},
              {headerName: 'Updated', field: '_updated', width: 25}
            ];

            // set table options 
            self.gridOptions = {
                columnDefs: columnDefs,
                rowData: null,
                enableFilter: true,
                ready: function(api){
                  api.sizeColumnsToFit();
                }
            };

            // load data
            self.page = 1;
            self.maxResults = 30;
            self.comments = [];
            var params = {
              max_results: self.maxResults,
              page: self.page
            };
            Comment.getList(params).then(function (comments) {
              var fields = _.pluck(columnDefs, 'field');
              angular.forEach(comments, function (comment) {
                self.comments.push(_.pick(comment, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(comments);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addComment = function () {
              self.comments.push(angular.copy(self.editingComment));
            };

            self.editComment = function(index) {
              self.comments.splice(index, 1, angular.copy(self.editingComment));
            };

            self.removeComment = function(index) {
              self.comments.splice(index, 1);
            };

          } // activate END
      }
    ]);
})();

/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('PracticeSessionsAdminController', [
      'PracticeSession',
      function PracticeSessionsAdminController(
        PracticeSession) {
          var self = this;

          activate();

          ////////////////

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 15},
              {headerName: 'Questions', field: 'questions', width: 25},
              {headerName: 'Answers', field: 'answers', width: 25},
              {headerName: 'Audio', field: 'audio', width: 25},
              {headerName: 'Platform', field: 'platform', width: 25},
              {
                headerName: 'Practice Set',
                field: 'practice_set',
                width: 35,
                valueGetter: function (params) {
                  return params.data.practice_set.title;
                }
              },
              {
                headerName: 'category',
                field: 'practice_set',
                width: 25,
                valueGetter: function (params) {
                  return params.data.practice_set.category;
                }
              },
              {headerName: 'Status', field: 'status', width: 25},
              {headerName: 'Created', field: '_created', width: 25},
              {headerName: 'Updated', field: '_updated', width: 25},
              {
                headerName: 'SubmittedBy',
                field: 'submitted_by',
                width: 25,
                valueGetter: function (params) {
                  return params.data.submitted_by.username;
                }
              },
            ];

            // set table options 
            self.gridOptions = {
                columnDefs: columnDefs,
                rowData: null,
                enableSorting: true,
                enableFilter: true,
                enableColResize: true
            };

            // load data
            self.maxResults = 9999;
            self.practiceSessions = [];
            var params = {
              embedded: {
                submitted_by: 1,
                practice_set: 1
              },
              max_results: self.maxResults,
            };
            PracticeSession.getList(params).then(function (practiceSessions) {
              var fields = _.pluck(columnDefs, 'field');
              angular.forEach(practiceSessions, function (practiceSession) {
                self.practiceSessions.push(_.pick(practiceSession, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(practiceSessions);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addPracticeSession = function () {
              self.practiceSessions.push(angular.copy(self.editingPracticeSession));
            };

            self.editPracticeSession = function(index) {
              self.practiceSessions.splice(index, 1, angular.copy(self.editingPracticeSession));
            };

            self.removePerson = function(index) {
              self.practiceSessions.splice(index, 1);
            };

          } // activate END
      }
    ]);
})();

/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('PracticeSetsAdminController', [
      'PracticeSet',
      function PracticeSetsAdminController(
        PracticeSet) {
          var self = this;

          activate();

          ////////////////

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 15},
              {headerName: 'Title', field: 'title', width: 25},
              {headerName: 'Category', field: 'category', width: 25},
              {
                headerName: 'Questions',
                field: 'questions',
                width: 25,
                valueGetter: function (params) {
                  var value = '';
                  angular.forEach(params.data.questions, function (question) {
                    value += question.text.translations.en + '<br>'; 
                  });
                  return value;
                }
              },
              {headerName: 'Description', field: 'description', width: 25},
              {headerName: 'Status', field: 'status', width: 25},
              {headerName: 'Created', field: '_created', width: 25},
              {headerName: 'Updated', field: '_updated', width: 25},
              {
                headerName: 'Submitted By',
                field: 'submitted_by',
                width: 25,
                valueGetter: function (params) {
                  return params.data.submitted_by.username;
                }
              }
            ];

            // set table options 
            self.gridOptions = {
                columnDefs: columnDefs,
                rowData: null,
                enableColResize: true,
                enableSorting: true,
                enableFilter: true,
                // TODO: this doesn't work for some reason
                getRowHeight: function (params) {
                  console.log('settings height', (params.data.questions.length * 25));
                  return (params.data.questions.length * 25);
                }
            };

            // load data
            self.page = 1;
            self.maxResults = 30;
            self.practiceSets = [];
            var params = {
              embedded: {
                questions: 1,
                submitted_by: 1
              },
              max_results: self.maxResults,
              page: self.page
            };
            PracticeSet.getList(params).then(function (practiceSets) {
              var fields = _.pluck(columnDefs, 'field');
              angular.forEach(practiceSets, function (practiceSet) {
                self.practiceSets.push(_.pick(practiceSet, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(practiceSets);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addPracticeSet = function () {
              self.practiceSets.push(angular.copy(self.editingPracticeSet));
            };

            self.editPracticeSet = function(index) {
              self.practiceSets.splice(index, 1, angular.copy(self.editingPracticeSet));
            };

            self.removePracticeSet = function(index) {
              self.practiceSets.splice(index, 1);
            };

          } // activate END
      }
    ]);
})();

/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('QuestionssAdminController', [
      'Question',
      function QuestionssAdminController(
        Question) {
          var self = this;

          activate();

          ////////////////

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 20},
              {headerName: 'Category', field: 'category', width: 12},
              {
                headerName: 'en Text',
                field: 'text',
                width: 50,
                valueGetter: function (params) {
                  return params.data.text.translations.en;
                }
              },
              {
                headerName: 'de Text',
                field: 'text',
                width: 50,
                valueGetter: function (params) {
                  return params.data.text.translations.de;
                }
              },
              {
                headerName: 'SubmittedBy',
                field: 'submitted_by',
                width: 25,
                valueGetter: function (params) {
                  return params.data.submitted_by.username;
                }
              },
              {headerName: 'Created', field: '_created', width: 25},
              {headerName: 'Updated', field: '_updated', width: 25, sort: 'asc'}
            ];

            function textValueGetter(params) {
              return params.data.text.translations.en;
            }

            // set table options 
            self.gridOptions = {
              columnDefs: columnDefs,
              rowData: null,
              enableSorting: true,
              enableFilter: true,
              enableColResize: true
            };

            // load data
            self.page = 1;
            self.maxResults = 500;
            self.questionss = [];
            var params = {
              embedded: {
                submitted_by: 1,
                tags: 1
              },
              max_results: self.maxResults,
              page: self.page
            };
            Question.getList(params).then(function (questionss) {
              var fields = _.pluck(columnDefs, 'field');
              angular.forEach(questionss, function (questions) {
                self.questionss.push(_.pick(questions, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(questionss);
              self.gridOptions.api.sizeColumnsToFit();
              self.gridOptions.api.enableColResize = true;
            });
            
            // funtions
            self.addQuestion = function () {
              self.questionss.push(angular.copy(self.editingQuestion));
            };

            self.editQuestion = function(index) {
              self.questionss.splice(index, 1, angular.copy(self.editingQuestion));
            };

            self.removePerson = function(index) {
              self.questionss.splice(index, 1);
            };

          } // activate END
      }
    ]);
})();

/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('RatingsAdminController', [
      'Rating',
      function RatingsAdminController(
        Rating) {
          var self = this;

          activate();

          ////////////////

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 15},
              {headerName: 'Context', field: 'context', width: 25},
              {headerName: 'LanguageCode', field: 'language_code', width: 25},
              {headerName: 'Rating', field: 'rating', width: 25},
              {headerName: 'AffectedUser', field: 'affected_user', width: 25},
              {headerName: 'Parent', field: 'parent', width: 25},
              {headerName: 'SubmittedBy', field: 'submitted_by', width: 25},
              {headerName: 'Created', field: '_created', width: 25},
              {headerName: 'Updated', field: '_updated', width: 25}
            ];

            // set table options 
            self.gridOptions = {
                columnDefs: columnDefs,
                rowData: null,
                enableFilter: true,
                ready: function(api){
                  api.sizeColumnsToFit();
                }
            };

            // load data
            self.page = 1;
            self.maxResults = 30;
            self.ratings = [];
            var params = {
              max_results: self.maxResults,
              page: self.page
            };
            Rating.getList(params).then(function (ratings) {
              var fields = _.pluck(columnDefs, 'field');
              angular.forEach(ratings, function (rating) {
                self.ratings.push(_.pick(rating, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(ratings);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addRating = function () {
              self.ratings.push(angular.copy(self.editingRating));
            };

            self.editRating = function(index) {
              self.ratings.splice(index, 1, angular.copy(self.editingRating));
            };

            self.removePerson = function(index) {
              self.ratings.splice(index, 1);
            };

          } // activate END
      }
    ]);
})();

/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('SessionsAdminController', [
      'Session',
      function SessionsAdminController(
        Session) {
          var self = this;

          activate();

          ////////////////

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 15},
              {headerName: 'Username', field: 'username', width: 25},
              {headerName: 'Roles', field: 'roles', width: 25},
              {headerName: 'Created', field: '_created', width: 25},
              {headerName: 'Updated', field: '_updated', width: 25}
            ];

            // set table options 
            self.gridOptions = {
                columnDefs: columnDefs,
                rowData: null,
                enableFilter: true,
                ready: function(api){
                  api.sizeColumnsToFit();
                }
            };

            // load data
            self.page = 1;
            self.maxResults = 30;
            self.sessions = [];
            var params = {
              max_results: self.maxResults,
              page: self.page
            };
            Session.getList(params).then(function (sessions) {
              var fields = _.pluck(columnDefs, 'field');
              angular.forEach(sessions, function (session) {
                self.sessions.push(_.pick(session, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(sessions);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addSession = function () {
              self.sessions.push(angular.copy(self.editingSession));
            };

            self.editSession = function(index) {
              self.sessions.splice(index, 1, angular.copy(self.editingSession));
            };

            self.removePerson = function(index) {
              self.sessions.splice(index, 1);
            };

          } // activate END
      }
    ]);
})();

/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('TagsAdminController', [
      'Tag',
      function TagsAdminController(
        Tag) {
          var self = this;

          activate();

          ////////////////

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 15},
              {headerName: 'Text', field: 'text', width: 25},
              {headerName: 'Status', field: 'status', width: 25},
              {headerName: 'SubmittedBy', field: 'submitted_by', width: 25},
              {headerName: 'Created', field: '_created', width: 25},
              {headerName: 'Updated', field: '_updated', width: 25}
            ];

            // set table options 
            self.gridOptions = {
                columnDefs: columnDefs,
                rowData: null,
                enableFilter: true,
                ready: function(api){
                  api.sizeColumnsToFit();
                }
            };

            // load data
            self.page = 1;
            self.maxResults = 30;
            self.tags = [];
            var params = {
              max_results: self.maxResults,
              page: self.page
            };
            Tag.getList(params).then(function (tags) {
              var fields = _.pluck(columnDefs, 'field');
              angular.forEach(tags, function (tag) {
                self.tags.push(_.pick(tag, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(tags);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addTag = function () {
              self.tags.push(angular.copy(self.editingTag));
            };

            self.editTag = function(index) {
              self.tags.splice(index, 1, angular.copy(self.editingTag));
            };

            self.removeTag = function(index) {
              self.tags.splice(index, 1);
            };

          } // activate END
      }
    ]);
})();

/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('UsersAdminController', [
      'User',
      function UsersAdminController(
        User) {
          var self = this;

          activate();

          ////////////////

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 15},
              {headerName: 'FirstName', field: 'first_name', width: 25},
              {headerName: 'LastName', field: 'last_name', width: 25},
              {headerName: 'Username', field: 'username', width: 25},
              {headerName: 'City', field: 'city', width: 25},
              {headerName: 'Country', field: 'country', width: 25},
              {headerName: 'Speaks', field: 'speaks', width: 25},
              {headerName: 'Learning', field: 'learning', width: 25},
              {headerName: 'Points', field: 'points', width: 25},
              {headerName: 'Created', field: '_created', width: 25},
              {headerName: 'Last Login', field: 'last_login', width: 25}
            ];

            // set table options 
            self.gridOptions = {
                columnDefs: columnDefs,
                rowData: null,
                enableFilter: true,
                ready: function(api){
                  api.sizeColumnsToFit();
                }
            };

            // load data
            self.page = 1;
            self.maxResults = 30;
            self.users = [];
            var params = {
              max_results: self.maxResults,
              page: self.page
            };
            User.getList(params).then(function (users) {
              var fields = _.pluck(columnDefs, 'field');
              angular.forEach(users, function (user) {
                self.users.push(_.pick(user, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(users);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addUser = function () {
              self.users.push(angular.copy(self.editingUser));
            };

            self.editUser = function(index) {
              self.users.splice(index, 1, angular.copy(self.editingUser));
            };

            self.removePerson = function(index) {
              self.users.splice(index, 1);
            };

          } // activate END
      }
    ]);
})();

(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name tandemWebApp.controller:AudioPlayerCtrl
     * @description
     * # AudioPlayerCtrl
     * Controller of the tandemWebApp
     */
    angular.module('app.audio').controller('AudioPlayerCtrl', [
      '$scope',
      'toaster',
      'ngAudio',
      'Recording',
      'Comment',
      'session',
       function (
        $scope,
        toaster,
        ngAudio, 
        Recording, 
        Comment,
        session) {
        var self = this;
     
        self.processing = true;
        self.player = false;
        self.comments = [];
        self.showComment = false;

        // sets watch vars for player object
        self.initPlayer = function (url, readyStatus, playedStatus) {
          if (self.player) {
            delete self.player;
          }

          // watch for player errors
          self.clearPlayerErrorWatch();
          self.playerErrorWatch = $scope.$watch(angular.bind(self, function () {
            return self.player.error;
          }), function (newVal, oldVal) {
            if (newVal === true) {
              console.log('player had errors');
              self.updatePlayerDisplay(readyStatus);
            }
          });

          // watch player read
          self.clearPlayerReadyWatch();
          self.playerReadyWatch = $scope.$watch(angular.bind(self, function () {
            return self.player.canPlay;
          }), function (newVal, oldVal) {
            if (newVal === true) {
              console.log('player ready');
              self.playerEnd = self.player.remaining;
              self.updatePlayerDisplay(readyStatus);

              // auto play if set
              if (self.autoPlay === "true") {
                if (self.context === 'question') {
                   self.playQuestion();
                }
                if (self.context === 'answer') {
                   self.playAnswer();
                }
              }
            }
          });

          // track the players progress
          self.clearPlayerProgressWatch();
          self.playerProgressWatch = $scope.$watch(angular.bind(self, function() { 
            return self.player.progress;
          }), function(newVal, oldVal) {
            var roundedTime = Math.round(newVal * 100) / 100;
            // when the audio is done playing
            if (newVal ===  1) {
              self.updatePlayerDisplay(playedStatus);
              self.stopCallback();  
            }

            angular.forEach(self.comments, function(comment) {
              var commentRoundedTime = Math.round(comment.progress * 100) / 100;
              if (commentRoundedTime === roundedTime) {
                $scope.$emit('show-timeline-comment', comment);
              }
            });
          });
          
          self.player = ngAudio.load(url);
          if (self.timeline === "true") {
            self.loadTimelineComments();
          } 
        };

        self.loadTimelineComments = function () {
          // load comments
          var params = {
            "where": {
              "parent": self.recording._id,
              "progress": {$ne: null}
            },
            "sort": "progress"
          }
          Comment.getList(params).then(function (comments) {
            self.comments = comments;
            $scope.$emit('update-timeline-comments', comments);
          });
        };

        self.saveComment = function () {
          var newComment = {
            "submitted_by": session.userId,
            "username": session.username,
            "progress": self.player.progress,
            "affected_user": self.recording.submitted_by._id,
            "context": self.recording.context,
            "language_code": self.recording.language_code,
            "parent": self.recording._id,
            "text": self.userComment
          }

          Comment.post(newComment).then(function (response) {
            Comment.get(response._id).then(function (comment) {
              self.comments.push(comment);
              self.userComment = null;
              $scope.$emit('update-timeline-comments', self.comments);
            });
            toaster.pop('success', 'Comment Saved', 'Thanks!');
          }, function (response) {
            toaster.pop('error', 'Server Error', 'Please try again in a moment.');
          });
        }

        self.playQuestion = function () {
          self.player.play();
          self.updatePlayerDisplay('questionPlaying');
        };

        self.playAnswer = function () {
          self.player.play();
          self.updatePlayerDisplay('answerPlaying');
        };

        self.pauseQuestion = function () {
          self.player.pause();
          self.updatePlayerDisplay('questionQueued');
        };

        self.pauseAnswer = function () {
          self.player.pause();
          self.updatePlayerDisplay('answerQueued');
        };

        self.clearPlayerProgressWatch = function () {
          if (self.playerProgressWatch) {
            self.playerProgressWatch();
          };
        };

        self.clearPlayerReadyWatch = function () {
          if (self.playerReadyWatch) {
            self.playerReadyWatch();
          };
        };

        self.clearPlayerErrorWatch = function () {
          if (self.playerErrorWatch) {
            self.playerErrorWatch();
          };
        };
     
        self.updatePlayerDisplay = function (currentStatus) {
          if (currentStatus === 'processing') {
            self.processing = true;
            self.showPlayAnswer = false;
            self.showPlayQuestion = false;
            self.playingQuestion = false;
            self.playingAnswer = false;
            self.showComplete = false;
          };
          if (currentStatus === 'questionQueued') {
            self.processing = false;
            self.showPlayAnswer = false;
            self.showPlayQuestion = true;
            self.playingQuestion = false;
            self.playingAnswer = false;
            self.showComplete = false;
          };
          if (currentStatus === 'questionPlaying') {
            self.processing = false;
            self.showPlayAnswer = false;
            self.showPlayQuestion = false;
            self.playingQuestion = true;
            self.playingAnswer = false;
            self.showComplete = false;
          };
          if (currentStatus === 'answerQueued') {
            self.processing = false;
            self.showPlayAnswer = true;
            self.showPlayQuestion = false;
            self.playingQuestion = false;
            self.playingAnswer = false;
            self.showComplete = false;
          };
          if (currentStatus === 'answerPlaying') {
            self.processing = false;
            self.showPlayAnswer = false;
            self.showPlayQuestion = false;
            self.playingQuestion = false;
            self.playingAnswer = true;
            self.showComplete = false;
          };
          if (currentStatus === 'completed') {
            self.processing = false;
            self.showPlayAnswer = false;
            self.showPlayQuestion = false;
            self.playingQuestion = false;
            self.playingAnswer = false;
            self.showComplete = true;
          };
        };

        self.updatePlayerDisplay('processing');
        if (self.recording) {
          if (!self.url) {
            Recording.get(self.recording._id).then(function (recording) {
              var blob = recording.createBlob();
              self.url = URL.createObjectURL(blob);
              self.initPlayer(self.url, self.context + 'Queued', self.context + 'Queued');
            });
          }
        }

        self.urlWatch = $scope.$watch(angular.bind(self, function() { 
          return self.url;
        }), function(newVal, oldVal) {
          var pattern = /^(blob:)?https?.+$/;
          if (pattern.test(newVal)) {
            self.url = newVal;
            self.initPlayer(self.url, self.context + 'Queued', self.context + 'Queued');
          }
        });

      }
    ]);
})();

(function() {
  'use strict';
  
  angular.module('app.audio').directive('audioPlayer', function () {                             
    return {
        templateUrl: 'app/views/audio-player.html',
        restrict: 'E',
        controller: 'AudioPlayerCtrl', 
        controllerAs: 'audioPlayerCtrl', 
        bindToController: true,
        scope: {
          recording: '=',
          url: '@',
          context: '@',
          autoPlay: '@',
          timeline: '@',
          playCallback: '&onPlay',
          stopCallback: '&onStop',
          clickCallback: '&onTimelineClick'
        }
    };      
  });
})();

/**
 * This script adds a new function to a function prototype,
 * which allows a function to be converted to a web worker.
 *
 * Please note that this method copies the function's source code into a Blob, so references to variables
 * outside the function's own scope will be invalid.
 *
 * You can however pass variables that can be serialized into JSON, to this function using the params parameter
 *
 * @usage
 * ```
 * myFunction.toWorker({param1: p1, param2: p2...})
 *```
 *
 */
(function () {
  'use strict';


  var workerToBlobUrl = function (fn, params) {
    if (typeof fn !== 'function') {
      throw("The specified parameter must be a valid function");
    }
    var fnString = fn.toString();
    if (fnString.match(/\[native\s*code\]/i)) {
      throw("You cannot bind a native function to a worker");
    }
    ;

    params = params || {};
    if (typeof params !== 'object') {
      console.warn('Params must be an object that is serializable with JSON.stringify, specified is: ' + (typeof params));
    }

    var blobURL = window.URL.createObjectURL(new Blob(['(', fnString, ')(this,', JSON.stringify(params), ')'], {type: 'application/javascript'}));

    return blobURL;
  };

  Function.prototype.toWorker = function (params) {
    var url = workerToBlobUrl(this, params);
    return new Worker(url);
  };
})();

(function () {
'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:RecorderCtrl
 * @description
 * # RecorderCtrl
 * Controller of the tandemWebApp
 */
angular.module('app.audio')
.controller('RecorderCtrl', [
  '$scope',
  '$q',
  'ngAudio',
  'toaster',
  'Recording',
  'Question',
  'Activity',
  'session',
  'recorder',
   function (
    $scope,
    $q,
    ngAudio,
    toaster, 
    Recording,
    Question,
    Activity,
    session,
    recorder) {
    var self = this;

    // instantiate question object
    if (self.questionType !== 'object') {
      var params = {
        "embedded": {
          "submitted_by": 1
        }
      }

      Question.get(self.question, params).then(function (question) {
        self.question = question;
      });
    };
 
    self.speaksCode = session.speaks;
    self.learningCode = session.learning;
    self.speaksText = session.speaksText; 
    self.learningText = session.learningText;

    self.processing = false;
    self.showMicrophone = true;
    self.recordingBlob = null;
    self.recordingQuestion = null; 

    self.startRecording = function () {
      self.updateRecorderDisplay('previewRecording');
      recorder.record();
      self.startRecordCallback();
    };

    self.stopRecording = function (playerId, language) {
      self.updateRecorderDisplay('processing');
      recorder.stop().then(function (url) {
        self.recordingBlob = recorder.blob;
        self.recordingUrl = url;
        self.initPlayer(url, 'previewQueued', 'saveQueued');
        self.stopRecordCallback();
      });
    };

    self.initPlayer = function (url, readyStatus, playedStatus) {
        if (self.player) {
          delete self.player;
        }

        // watch for player errors
        self.clearPlayerErrorWatch();
        self.playerErrorWatch = $scope.$watch(angular.bind(self, function () {
          return self.player.error;
        }), function (newVal, oldVal) {
          if (newVal === true) {
            console.log('player had errors');
            self.updateRecorderDisplay(readyStatus);
          }
        });

        // watch player read
        self.clearPlayerReadyWatch();
        self.playerReadyWatch = $scope.$watch(angular.bind(self, function () {
          return self.player.canPlay;
        }), function (newVal, oldVal) {
          if (newVal === true) {
            console.log('player ready');
            self.updateRecorderDisplay(readyStatus);
            if (self.autoPlay === "true") {
              self.playPreview();
            }
          }
        });

        // track the players progress
        self.clearPlayerProgressWatch();
        self.playerProgressWatch = $scope.$watch(angular.bind(self, function() { 
          return self.player.progress;
        }), function(newVal, oldVal) {
          // TODO: use for progress bar
          self.playerProgress = newVal;
          if (newVal ===  1) {
            self.updateRecorderDisplay(playedStatus);
           }
        });

        self.player = ngAudio.load(url);
        console.log('url loaded');

        /**
        * hack for an intermitten problem loading
        * newly recorded audio
        * this happens usually after around the 5th or 6th recording
        * and I'm still not sure if its a problem with the
        * recorder or the player
        */
        self.bugWatch = setTimeout(function () {
          if ((!self.player.canPlay) && (self.processing)) {
            toaster.pop('error', "Recording Problem", "There was an audio problem.  Please try again in a few moments.");
            recorder.clear();
            recorder.initRecorder();
            self.updateRecorderDisplay('recordingQueued');
          }
        }, 5000);
    };

    self.clearPlayerProgressWatch = function () {
      if (self.playerProgressWatch) {
        self.playerProgressWatch();
      };
    };

    self.clearPlayerReadyWatch = function () {
      if (self.playerReadyWatch) {
        self.playerReadyWatch();
      };
    };

    self.clearPlayerErrorWatch = function () {
      if (self.playerErrorWatch) {
        self.playerErrorWatch();
      };
    };

    self.pausePreview = function () {
      self.player.pause();
      self.updateRecorderDisplay('previewQueued');
    };

    self.playPreview = function () {
      self.player.play();
      self.updateRecorderDisplay('previewPlaying');
    };

    self.saveRecording = function () {
      var deferedSave = $q.defer();
      var blob = self.recordingBlob;
      self.updateRecorderDisplay('processing');

      // only allow one audio per question per user
      if (self.context === 'question') {
        var params = {
          submitted_by: session.userId,
          question: self.question._id,
          language_code: self.language,
          context: self.context
        } 
        Recording.getList({where: params}).then(function (audios) {
          audios.forEach(function (audio) {
            audio.remove();
          });
        }, $q.reject).then(function () {
          Recording.create(blob, self.context, self.language, self.question).then(function (recording) {
            console.log('recording saved');
            self.logActivity(recording);
            self.updateRecorderDisplay('recordingQueued');
            deferedSave.resolve(recording);
            self.saveCallback({ newRecording: recording }); 
          });
        });
      } else {
        // this is the first audio for this question for this user
        Recording.create(blob, self.context, self.language, self.question).then(function (recording) {
          console.log('recording saved');
          self.logActivity(recording);
          self.updateRecorderDisplay('recordingQueued');
          deferedSave.resolve(recording);
          self.saveCallback({ newRecording: recording }); 
        });
      } 
      return deferedSave.promise;
    };

    self.logActivity = function (audio) {
      // save user activity
      var activityData = {
        "action": "added audio",
        "context": self.context,
        "language": self.language,
        "affected_object": audio._id,
        "submitted_by": session.userId
      }
      Activity.post(activityData);
    }

    self.hideAll = function () {
      self.processing = false;
      self.recording = false;
      self.showMicrophone = false;
      self.showPlayPreview = false;
      self.recordinginQueued = false;
      self.previewPlaying = false;
      self.previewRecording = false;
      self.showSave = false;
      self.showComplete = false;
    };

    self.updateRecorderDisplay = function (currentStatus) {
      if (currentStatus === 'processing') {
        self.hideAll();
        self.processing = true;
      };
      if (currentStatus === 'recordingQueued') {
        self.hideAll();
        self.showMicrophone = true;
      };
      if (currentStatus === 'previewRecording') {
        self.hideAll();
        self.recording = true;
      };
      if (currentStatus === 'previewQueued') {
        self.hideAll();
        self.showPlayPreview = true;
        self.showRecorder = true;
      };
      if (currentStatus === 'previewPlaying') {
        self.hideAll();
        self.previewPlaying = true;
      };
      if (currentStatus === 'saveQueued') {
        self.hideAll();
        self.showPlayPreview = true;
        self.showMicrophone = true;
        self.showSave = true;
      };
      if (currentStatus === 'completed') {
        self.hideAll();
        self.showComplete = true;
      };
    };

  }
]);
})();

(function () {
  'use strict';
  
  angular.module('app.audio').directive('recorder', function () {                             
    return {
        templateUrl: 'app/views/recorder.html',
        restrict: 'E',
        controller: 'RecorderCtrl', 
        controllerAs: 'recorderCtrl',
        bindToController: true,
        scope: {
            question: '=',
            questionType: '@',
            context: '@', // question or answer
            language: '@',
            autoPlay: '@',
            startRecordCallback: '&onStartRecord',
            stopRecordCallback: '&onStopRecord',
            saveCallback: '&onSave',
        }
    };      
  });

})();

'use strict';

/* audio recorder service. */
angular.module('app.audio').service('recorder', [ 
  '$q',
  function recorder($q) {
    var self = this;

    self.recorder = false;
    self.recordingUrl = null;
    self.blob = null;
    self.recording = false;
    self.processing = false;

    // only set this once for session
    self.audioContext = new AudioContext;

    self.initRecorder = function () {
      var deferedInit = $q.defer();
      var recorder;

      try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
        window.URL = window.URL || window.webkitURL;

        console.log('Audio context set up.');
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
      } catch (e) {
        alert('No web audio support in this browser!');
      }

      navigator.getUserMedia({audio: true},
        // success callback 
        function startUserMedia(stream) {
          recorder = new Recorder(stream, self.audioContext);
          self.recorder = recorder;
          deferedInit.resolve(recorder);
          console.log('Recorder initialised.');
        },
        // error callback
        function (e) {
          console.log('No live audio input: ' + e);
          // TODO: test if we should reject the deferedInit here
        }
      );

      return deferedInit.promise;
    };

    self.record = function () {
      self.initRecorder().then(function (recorder) {
        self.recorder = recorder;
        self.recorder.record();
        console.log('Started recording');
      });
      self.recording = true;
    };

    self.stop = function () {
      self.recorder.stop();
      self.processing = true;
      return self.exportMP3();
    };

    self.exportMP3 = function () {
      var deferedUrl = $q.defer();
      self.recorder.exportMP3(function (blob) {
        URL.revokeObjectURL(self.recordingUrl);
        self.recordingUrl = URL.createObjectURL(blob);
        self.blob = blob;
        self.processing = false;
        deferedUrl.resolve(self.recordingUrl);
      });
      return deferedUrl.promise;
    };

    self.clear = function () {
      self.recorder.clear();
    };

    self.createUrl = function () {
      if (self.blob) {
        URL.revokeObjectURL(self.recordingUrl);
        self.recordingUrl = URL.createObjectURL(self.blob);
        return self.recordingUrl;
      }
      return false; 
    };
  }
]);

/***********************
 * IMPORTANT:  This script relies on the libmp3lame.min.js file
 * to be accessible from {domain}/vendor/libmp3lame.min.js, and
 * this vendor file is NOT managed by bower
 */
(function(window){
  'use strict';

  var RecorderWorker = function (me, params) {

    if (typeof Lame === 'undefined') {
      importScripts(params.lameUrl);
    }

    var recLength = 0,
      recBuffer = [],
      mp3codec,
      sampleRate;

    this.onmessage = function(e) {
      switch (e.data.command) {
        case 'init':
          init(e.data.sampleRate);
          break;
        case 'record':
          record(e.data.buffer);
          break;
        case 'exportMP3':
          exportMP3();
          break;
        case 'clear':
          clear();
          break;
      }
    };

    function init(rate) {
      sampleRate = rate;
      mp3codec = Lame.init();

      Lame.set_mode(mp3codec, Lame.MONO);
      Lame.set_num_channels(mp3codec, 1);
      Lame.set_num_samples(mp3codec, -1);
      Lame.set_in_samplerate(mp3codec, sampleRate);
      Lame.set_out_samplerate(mp3codec, sampleRate);
      Lame.set_bitrate(mp3codec, 16);

      Lame.init_params(mp3codec);
    }

    function record(inputBuffer) {
      recBuffer.push(inputBuffer);
      recLength += inputBuffer.length;
    }

    function clear() {
      Lame.encode_flush(mp3codec);
      Lame.close(mp3codec);
      mp3codec = null;
      recLength = 0;
      recBuffer = [];
      init(sampleRate);
    }

    function exportMP3() {
      var buffer = mergeBuffers();
      var mp3data = Lame.encode_buffer_ieee_float(mp3codec, buffer, buffer);
      var mp3Blob = new Blob(
        [ new Uint8Array(mp3data.data) ],
        { type: 'audio/mp3' }
      );
      this.postMessage(mp3Blob);
    }

    function mergeBuffers() {
      var result = new Float32Array(recLength),
        offset = 0, i = 0, len = recBuffer.length;
      for (; i < len; i++) {
        result.set(recBuffer[i], offset);
        offset += recBuffer[i].length;
      }
      return result;
    }
  };

  var SCRIPT_BASE = (function () {
    var scripts = document.getElementsByTagName('script');
    var myUrl = scripts[scripts.length - 1].getAttribute('src');
    var path = myUrl.substr(0, myUrl.lastIndexOf('/') + 1);
    if (path && !path.match(/:\/\//)) {
      var a = document.createElement('a');
      a.href = path;
       return a.href;
    }
    return path;
  }());

  var Recorder = function(stream, context){
    var audioInput, processor, gain, gainFunction, processorFunction;
    var recording = false, currCallback;

    gainFunction = context.createGain || context.createGainNode;
    gain = gainFunction.call(context);
    audioInput = context.createMediaStreamSource(stream);
    console.log('Media stream created.' );
    console.log("input sample rate " +context.sampleRate);

    audioInput.connect(gain);
    console.log('Input connected to audio context destination.');

    processorFunction = context.createScriptProcessor || context.createJavaScriptNode;
    processor = processorFunction.call(context, 4096, 2, 2);

    var config = {
      lameUrl: (SCRIPT_BASE + '/../../../vendor/recordmp3/js/libmp3lame.min.js')
    }
    var worker = RecorderWorker.toWorker(config);
    worker.postMessage({
      command: 'init',
      sampleRate: context.sampleRate
    });

    processor.onaudioprocess = function(e){
      if (!recording) return;
      worker.postMessage({
        command: 'record',
        buffer: e.inputBuffer.getChannelData(0)
      });
    }

    this.record = function(){
      recording = true;
    }

    this.stop = function(){
      recording = false;
    }

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    }

    this.exportMP3 = function(cb){
      currCallback = cb;
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({ command: 'exportMP3' });
    }

    worker.onmessage = function(e){
      var blob = e.data;
      currCallback(blob);
    }

    gain.connect(processor);
    processor.connect(context.destination);
  };

  window.Recorder = Recorder;

})(window);

'use strict';

/* audio recorder service. */
angular.module('app.audio').service('speechRecognition', [ 
  '$rootScope', 
  function speechRecognition($rootScope) {
    var self = this;

    self.recognition = null;
    self.recognizing = false;
    self.results = null;

    self.init = function (language) {
      self.reset();
      if ('webkitSpeechRecognition' in window) {
        self.recognition = new webkitSpeechRecognition();
        self.recognition.lang = self.getLanguage(language);
        self.recognition.continuous = true;
        self.recognition.interimResults = true;
        self.recognition.onerror = self.onError;
        self.recognition.onend = self.reset;
        self.recognition.onresult = self.onResult;
        return self.recognition.onstart = self.onStart;
      } else {
        self.recognition = {};
        console.log('webkitSpeechRecognition not supported');
      }
    };

    self.start = function () {
      self.recognition.start();
    };

    self.stop = function () {
      self.recognition.stop();
    };

    self.onResult = function (event) {
      var i, result, resultIndex, trans, _results
      resultIndex = event.resultIndex;
      trans = '';
      i = resultIndex;
      _results = [];
      while (i < event.results.length) {
        result = event.results[i][0];
        $rootScope.$emit('speech-detected-word', result.transcript);
        trans = self.capitalize(result.transcript);
        self.results = trans;
        if (event.results[i].isFinal) {
           return trans;
        }
        _results.push(++i);
      }
      return _results;
    };

    self.capitalize = function (string) {
      var first_char = /\S/;
      return string.replace(first_char, function(firstChar) {
        return firstChar.toUpperCase();
      });
    };

    self.reset = function (event) {
      self.recognizing = false;
    };

    self.onStart = function (event) {
      console.log('started speech detection.');
    };

    self.onError = function (event, message) {
      console.log('web speech error: ' + message);
    };
    
    self.getLanguage = function (languageCode) {
      if (languageCode === 'de') {
        return 'de-DE';
      };
      if (languageCode === 'en') {
        return 'en-US';
      };
      if (languageCode === 'en') {
        return 'es-ES';
      };
    };
  }
]);

(function() {
    'use strict';

    angular
        .module('app.authInterceptor')
        .factory(
            'authInterceptor',
            ['$injector', '$q', 'APP_CONFIG',
            function ($injector, $q, APP_CONFIG) {
                // NOTE: session service is not injected directly, because it depends
                // on the $http service and the latter's provider uses this
                // authInterceptor service --> circular dependency.
                // We thus inject need to inject session service on the fly (when it
                // is actually needed).

                return {
                    request: function (config) {
                        // TODO: use config object for URI matching
                        var token;
                        var session = $injector.get('session');
                        var isLocal = config.url.match(APP_CONFIG.API.rootURI);

                        // do not add auth to logout
                        if (config.url === APP_CONFIG.API.rootURI + '/logout') {
                            return config;
                        }

                        config.headers = config.headers || {};

                        // only add this if we know we are accessing our api
                        if ((isLocal) && (session.token)) {
                            config.headers.Authorization = 'Basic ' + session.token;
                        }

                        return config;
                    },

                    // If we receive an error response because authentication token
                    // is invalid/expired, we handle it by displaying a login modal.
                    //
                    // If login succeeds and a new token is obtained, the failed http
                    // request is transparently repeated with a correct token. If even
                    // this retried request (recognized by a special marker flag in
                    // request's http config) fails, the error is not further handled
                    // and is passed to through to the other parts of the application.
                    //
                    // Other types of http errors are not handled here and are simply
                    // passed through.
                    responseError: function (response) {
                        var configToRepeat,
                            failedRequestConfig,
                            retryDeferred,
                            session,
                            $http;

                        session = $injector.get('session');

                        if (response.config.IS_RETRY) {
                            // Tried to retry the initial failed request but failed
                            // again --> forward the error without another retry (to
                            // avoid a possible infinite loop).
                            return $q.reject(response);
                        }

                        if (response.status === 401) {
                            // Request failed due to invalid oAuth token - try to
                            // obtain a new token and then repeat the failed request.
                            failedRequestConfig = response.config;
                            retryDeferred = $q.defer();

                            /* TODO: implement this
                            session.newTokenByLoginModal()
                            .then(function () {
                                // new token successfully obtained, repeat the request
                                $http = $injector.get('$http');

                                configToRepeat = angular.copy(failedRequestConfig);
                                configToRepeat.IS_RETRY = true;

                                $http(configToRepeat)
                                .then(function (newResponse) {
                                    delete newResponse.config.IS_RETRY;
                                    retryDeferred.resolve(newResponse);
                                })
                                .catch(function () {
                                    retryDeferred.reject(response);
                                });
                            })
                            .catch(function () {
                                // obtaining new token failed, reject the request
                                retryDeferred.reject(response);
                            });
                            */
                            console.log('unauthorized');
                            return retryDeferred.promise;
                        } else {
                            // some non-authentication error occured, these kind of
                            // errors are not handled by this interceptor --> simply
                            // forward the error
                            return $q.reject(response);
                        }
                    }
                };
            }]
        );
})();

/**=========================================================
 * Module: chartist.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        .controller('ChartistController', ChartistController);

    function ChartistController() {
        var vm = this;

        activate();

        ////////////////

        function activate() {

          // Line chart
          // ----------------------------------- 

          vm.lineData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            series: [
              [12, 9, 7, 8, 5],
              [2, 1, 3.5, 7, 3],
              [1, 3, 4, 5, 6]
            ]
          };

          vm.lineOptions = {
            fullWidth: true,
            height: 220,
            chartPadding: {
              right: 40
            }
          };

          // Bar bipolar
          // ----------------------------------- 

          vm.barBipolarOptions = {
            high: 10,
            low: -10,
            height: 220,
            axisX: {
              labelInterpolationFnc: function(value, index) {
                return index % 2 === 0 ? value : null;
              }
            }
          };

          vm.barBipolarData = {
            labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
            series: [
              [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
            ]
          };


          // Bar horizontal
          // ----------------------------------- 

          vm.barHorizontalData = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            series: [
              [5, 4, 3, 7, 5, 10, 3],
              [3, 2, 9, 5, 4, 6, 4]
            ]
          };

          vm.barHorizontalOptions = {
            seriesBarDistance: 10,
            reverseData: true,
            horizontalBars: true,
            height: 220,
            axisY: {
              offset: 70
            }
          };

          // Smil Animations
          // ----------------------------------- 

          // Let's put a sequence number aside so we can use it in the event callbacks
          var seq = 0,
            delays = 80,
            durations = 500;

          vm.smilData = {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            series: [
              [12, 9, 7, 8, 5, 4, 6, 2, 3, 3, 4, 6],
              [4,  5, 3, 7, 3, 5, 5, 3, 4, 4, 5, 5],
              [5,  3, 4, 5, 6, 3, 3, 4, 5, 6, 3, 4],
              [3,  4, 5, 6, 7, 6, 4, 5, 6, 7, 6, 3]
            ]
          };

          vm.smilOptions = {
            low: 0,
            height: 260
          };

          vm.smilEvents = {
            created: function() {
              seq = 0;
            },
            draw: function(data) {
              seq++;

              if(data.type === 'line') {
                // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
                data.element.animate({
                  opacity: {
                    // The delay when we like to start the animation
                    begin: seq * delays + 1000,
                    // Duration of the animation
                    dur: durations,
                    // The value where the animation should start
                    from: 0,
                    // The value where it should end
                    to: 1
                  }
                });
              } else if(data.type === 'label' && data.axis === 'x') {
                data.element.animate({
                  y: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.y + 100,
                    to: data.y,
                    // We can specify an easing function from Chartist.Svg.Easing
                    easing: 'easeOutQuart'
                  }
                });
              } else if(data.type === 'label' && data.axis === 'y') {
                data.element.animate({
                  x: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.x - 100,
                    to: data.x,
                    easing: 'easeOutQuart'
                  }
                });
              } else if(data.type === 'point') {
                data.element.animate({
                  x1: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.x - 10,
                    to: data.x,
                    easing: 'easeOutQuart'
                  },
                  x2: {
                    begin: seq * delays,
                    dur: durations,
                    from: data.x - 10,
                    to: data.x,
                    easing: 'easeOutQuart'
                  },
                  opacity: {
                    begin: seq * delays,
                    dur: durations,
                    from: 0,
                    to: 1,
                    easing: 'easeOutQuart'
                  }
                });
              } 
            }
          };


          // SVG PATH animation
          // ----------------------------------- 

          vm.pathData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            series: [
              [1, 5, 2, 5, 4, 3],
              [2, 3, 4, 8, 1, 2],
              [5, 4, 3, 2, 1, 0.5]
            ]
          };

          vm.pathOptions = {
            low: 0,
            showArea: true,
            showPoint: false,
            fullWidth: true,
            height: 260
          };

          vm.pathEvents = {
            draw: function(data) {
              if(data.type === 'line' || data.type === 'area') {
                data.element.animate({
                  d: {
                    begin: 2000 * data.index,
                    dur: 2000,
                    from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                    to: data.path.clone().stringify(),
                    easing: Chartist.Svg.Easing.easeOutQuint
                  }
                });
              }
            }
          };

        }
    }
})();


/**=========================================================
 * Module: chart.controller.js
 * Controller for ChartJs
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        .controller('ChartJSController', ChartJSController);

    ChartJSController.$inject = ['Colors'];
    function ChartJSController(Colors) {
        var vm = this;

        activate();

        ////////////////

        function activate() {

          // random values for demo
          var rFactor = function(){ return Math.round(Math.random()*100); };

          // Line chart
          // ----------------------------------- 

          vm.lineData = {
              labels : ['January','February','March','April','May','June','July'],
              datasets : [
                {
                  label: 'My First dataset',
                  fillColor : 'rgba(114,102,186,0.2)',
                  strokeColor : 'rgba(114,102,186,1)',
                  pointColor : 'rgba(114,102,186,1)',
                  pointStrokeColor : '#fff',
                  pointHighlightFill : '#fff',
                  pointHighlightStroke : 'rgba(114,102,186,1)',
                  data : [rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor()]
                },
                {
                  label: 'My Second dataset',
                  fillColor : 'rgba(35,183,229,0.2)',
                  strokeColor : 'rgba(35,183,229,1)',
                  pointColor : 'rgba(35,183,229,1)',
                  pointStrokeColor : '#fff',
                  pointHighlightFill : '#fff',
                  pointHighlightStroke : 'rgba(35,183,229,1)',
                  data : [rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor()]
                }
              ]
            };


          vm.lineOptions = {
            scaleShowGridLines : true,
            scaleGridLineColor : 'rgba(0,0,0,.05)',
            scaleGridLineWidth : 1,
            bezierCurve : true,
            bezierCurveTension : 0.4,
            pointDot : true,
            pointDotRadius : 4,
            pointDotStrokeWidth : 1,
            pointHitDetectionRadius : 20,
            datasetStroke : true,
            datasetStrokeWidth : 2,
            datasetFill : true,
          };


          // Bar chart
          // ----------------------------------- 

          vm.barData = {
              labels : ['January','February','March','April','May','June','July'],
              datasets : [
                {
                  fillColor : Colors.byName('info'),
                  strokeColor : Colors.byName('info'),
                  highlightFill: Colors.byName('info'),
                  highlightStroke: Colors.byName('info'),
                  data : [rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor()]
                },
                {
                  fillColor : Colors.byName('primary'),
                  strokeColor : Colors.byName('primary'),
                  highlightFill : Colors.byName('primary'),
                  highlightStroke : Colors.byName('primary'),
                  data : [rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor(),rFactor()]
                }
              ]
          };
          
          vm.barOptions = {
            scaleBeginAtZero : true,
            scaleShowGridLines : true,
            scaleGridLineColor : 'rgba(0,0,0,.05)',
            scaleGridLineWidth : 1,
            barShowStroke : true,
            barStrokeWidth : 2,
            barValueSpacing : 5,
            barDatasetSpacing : 1,
          };


          //  Doughnut chart
          // ----------------------------------- 
          
          vm.doughnutData = [
                {
                  value: 300,
                  color: Colors.byName('purple'),
                  highlight: Colors.byName('purple'),
                  label: 'Purple'
                },
                {
                  value: 50,
                  color: Colors.byName('info'),
                  highlight: Colors.byName('info'),
                  label: 'Info'
                },
                {
                  value: 100,
                  color: Colors.byName('yellow'),
                  highlight: Colors.byName('yellow'),
                  label: 'Yellow'
                }
              ];

          vm.doughnutOptions = {
            segmentShowStroke : true,
            segmentStrokeColor : '#fff',
            segmentStrokeWidth : 2,
            percentageInnerCutout : 85,
            animationSteps : 100,
            animationEasing : 'easeOutBounce',
            animateRotate : true,
            animateScale : false
          };

          // Pie chart
          // ----------------------------------- 

          vm.pieData =[
                {
                  value: 300,
                  color: Colors.byName('purple'),
                  highlight: Colors.byName('purple'),
                  label: 'Purple'
                },
                {
                  value: 40,
                  color: Colors.byName('yellow'),
                  highlight: Colors.byName('yellow'),
                  label: 'Yellow'
                },
                {
                  value: 120,
                  color: Colors.byName('info'),
                  highlight: Colors.byName('info'),
                  label: 'Info'
                }
              ];

          vm.pieOptions = {
            segmentShowStroke : true,
            segmentStrokeColor : '#fff',
            segmentStrokeWidth : 2,
            percentageInnerCutout : 0, // Setting this to zero convert a doughnut into a Pie
            animationSteps : 100,
            animationEasing : 'easeOutBounce',
            animateRotate : true,
            animateScale : false
          };

          // Polar chart
          // ----------------------------------- 
          
          vm.polarData = [
                {
                  value: 300,
                  color: Colors.byName('pink'),
                  highlight: Colors.byName('pink'),
                  label: 'Red'
                },
                {
                  value: 50,
                  color: Colors.byName('purple'),
                  highlight: Colors.byName('purple'),
                  label: 'Green'
                },
                {
                  value: 100,
                  color: Colors.byName('pink'),
                  highlight: Colors.byName('pink'),
                  label: 'Yellow'
                },
                {
                  value: 140,
                  color: Colors.byName('purple'),
                  highlight: Colors.byName('purple'),
                  label: 'Grey'
                },
              ];

          vm.polarOptions = {
            scaleShowLabelBackdrop : true,
            scaleBackdropColor : 'rgba(255,255,255,0.75)',
            scaleBeginAtZero : true,
            scaleBackdropPaddingY : 1,
            scaleBackdropPaddingX : 1,
            scaleShowLine : true,
            segmentShowStroke : true,
            segmentStrokeColor : '#fff',
            segmentStrokeWidth : 2,
            animationSteps : 100,
            animationEasing : 'easeOutBounce',
            animateRotate : true,
            animateScale : false
          };


          // Radar chart
          // ----------------------------------- 

          vm.radarData = {
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [
              {
                label: 'My First dataset',
                fillColor: 'rgba(114,102,186,0.2)',
                strokeColor: 'rgba(114,102,186,1)',
                pointColor: 'rgba(114,102,186,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(114,102,186,1)',
                data: [65,59,90,81,56,55,40]
              },
              {
                label: 'My Second dataset',
                fillColor: 'rgba(151,187,205,0.2)',
                strokeColor: 'rgba(151,187,205,1)',
                pointColor: 'rgba(151,187,205,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(151,187,205,1)',
                data: [28,48,40,19,96,27,100]
              }
            ]
          };

          vm.radarOptions = {
            scaleShowLine : true,
            angleShowLineOut : true,
            scaleShowLabels : false,
            scaleBeginAtZero : true,
            angleLineColor : 'rgba(0,0,0,.1)',
            angleLineWidth : 1,
            /*jshint -W109*/
            pointLabelFontFamily : "'Arial'",
            pointLabelFontStyle : 'bold',
            pointLabelFontSize : 10,
            pointLabelFontColor : '#565656',
            pointDot : true,
            pointDotRadius : 3,
            pointDotStrokeWidth : 1,
            pointHitDetectionRadius : 20,
            datasetStroke : true,
            datasetStrokeWidth : 2,
            datasetFill : true
          };
        }
    }
})();

/**=========================================================
 * Module: chart.js
 * Wrapper directive for chartJS. 
 * Based on https://gist.github.com/AndreasHeiberg/9837868
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        /* Aliases for various chart types */
        .directive('linechart',     chartJS('Line')      )
        .directive('barchart',      chartJS('Bar')       )
        .directive('radarchart',    chartJS('Radar')     )
        .directive('polarchart',    chartJS('PolarArea') )
        .directive('piechart',      chartJS('Pie')       )
        .directive('doughnutchart', chartJS('Doughnut')  )
        .directive('donutchart',    chartJS('Doughnut')  )
        ;

    function chartJS(type) {
        return function() {
            return {
                restrict: 'A',
                scope: {
                    data: '=',
                    options: '=',
                    id: '@',
                    width: '=',
                    height: '=',
                    resize: '=',
                    chart: '@',
                    segments: '@',
                    responsive: '=',
                    tooltip: '=',
                    legend: '='
                },
                link: function ($scope, $elem) {
                    var ctx = $elem[0].getContext('2d');
                    var autosize = false;

                    $scope.size = function () {
                        if ($scope.width <= 0) {
                            $elem.width($elem.parent().width());
                            ctx.canvas.width = $elem.width();
                        } else {
                            ctx.canvas.width = $scope.width || ctx.canvas.width;
                            autosize = true;
                        }

                        if($scope.height <= 0){
                            $elem.height($elem.parent().height());
                            ctx.canvas.height = ctx.canvas.width / 2;
                        } else {
                            ctx.canvas.height = $scope.height || ctx.canvas.height;
                            autosize = true;
                        }
                    };

                    $scope.$watch('data', function (newVal) {
                        if(chartCreated)
                            chartCreated.destroy();

                        // if data not defined, exit
                        if (!newVal) {
                            return;
                        }
                        if ($scope.chart) { type = $scope.chart; }

                        if(autosize){
                            $scope.size();
                            chart = new Chart(ctx);
                        }

                        if($scope.responsive || $scope.resize)
                            $scope.options.responsive = true;

                        if($scope.responsive !== undefined)
                            $scope.options.responsive = $scope.responsive;

                        chartCreated = chart[type]($scope.data, $scope.options);
                        chartCreated.update();
                        if($scope.legend)
                            angular.element($elem[0]).parent().after( chartCreated.generateLegend() );
                    }, true);

                    $scope.$watch('tooltip', function (newVal) {
                        if (chartCreated)
                            chartCreated.draw();
                        if(newVal===undefined || !chartCreated.segments)
                            return;
                        if(!isFinite(newVal) || newVal >= chartCreated.segments.length || newVal < 0)
                            return;
                        var activeSegment = chartCreated.segments[newVal];
                        activeSegment.save();
                        activeSegment.fillColor = activeSegment.highlightColor;
                        chartCreated.showTooltip([activeSegment]);
                        activeSegment.restore();
                    }, true);

                    $scope.size();
                    var chart = new Chart(ctx);
                    var chartCreated;
                }
            };
        };
    }
})();





/**=========================================================
 * Module: classy-loader.js
 * Enable use of classyloader directly from data attributes
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        .directive('classyloader', classyloader);

    classyloader.$inject = ['$timeout', 'Utils', '$window'];
    function classyloader ($timeout, Utils, $window) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          var $scroller       = $($window),
              inViewFlagClass = 'js-is-in-view'; // a classname to detect when a chart has been triggered after scroll

          // run after interpolation  
          $timeout(function(){
      
            var $element = $(element),
                options  = $element.data();
            
            // At lease we need a data-percentage attribute
            if(options) {
              if( options.triggerInView ) {

                $scroller.scroll(function() {
                  checkLoaderInVIew($element, options);
                });
                // if the element starts already in view
                checkLoaderInVIew($element, options);
              }
              else
                startLoader($element, options);
            }

          }, 0);

          function checkLoaderInVIew(element, options) {
            var offset = -20;
            if( ! element.hasClass(inViewFlagClass) &&
                Utils.isInView(element, {topoffset: offset}) ) {
              startLoader(element, options);
            }
          }
          function startLoader(element, options) {
            element.ClassyLoader(options).addClass(inViewFlagClass);
          }
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.charts')
        .service('ChartData', ChartData);

    ChartData.$inject = ['$resource'];
    function ChartData($resource) {
        this.load = load;

        ////////////////
      
        var opts = {
            get: { method: 'GET', isArray: true }
          };
        function load(source) {
          return $resource(source, {}, opts).get();
        }
    }
})();

/**=========================================================
 * Module: flot-chart.js
 * Setup options and data for flot chart directive
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        .controller('FlotChartController', FlotChartController);

    FlotChartController.$inject = ['$scope', 'ChartData', '$timeout'];
    function FlotChartController($scope, ChartData, $timeout) {
        var vm = this;

        activate();

        ////////////////

        function activate() {

          // BAR
          // -----------------------------------
          vm.barData = ChartData.load('server/chart/bar.json');
          vm.barOptions = {
              series: {
                  bars: {
                      align: 'center',
                      lineWidth: 0,
                      show: true,
                      barWidth: 0.6,
                      fill: 0.9
                  }
              },
              grid: {
                  borderColor: '#eee',
                  borderWidth: 1,
                  hoverable: true,
                  backgroundColor: '#fcfcfc'
              },
              tooltip: true,
              tooltipOpts: {
                  content: function (label, x, y) { return x + ' : ' + y; }
              },
              xaxis: {
                  tickColor: '#fcfcfc',
                  mode: 'categories'
              },
              yaxis: {
                  position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                  tickColor: '#eee'
              },
              shadowSize: 0
          };

          // BAR STACKED
          // -----------------------------------
          vm.barStackeData = ChartData.load('server/chart/barstacked.json');
          vm.barStackedOptions = {
              series: {
                  stack: true,
                  bars: {
                      align: 'center',
                      lineWidth: 0,
                      show: true,
                      barWidth: 0.6,
                      fill: 0.9
                  }
              },
              grid: {
                  borderColor: '#eee',
                  borderWidth: 1,
                  hoverable: true,
                  backgroundColor: '#fcfcfc'
              },
              tooltip: true,
              tooltipOpts: {
                  content: function (label, x, y) { return x + ' : ' + y; }
              },
              xaxis: {
                  tickColor: '#fcfcfc',
                  mode: 'categories'
              },
              yaxis: {
                  min: 0,
                  max: 200, // optional: use it for a clear represetation
                  position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                  tickColor: '#eee'
              },
              shadowSize: 0
          };

          // SPLINE
          // -----------------------------------
          vm.splineData = ChartData.load('server/chart/spline.json');
          vm.splineOptions = {
              series: {
                  lines: {
                      show: false
                  },
                  points: {
                      show: true,
                      radius: 4
                  },
                  splines: {
                      show: true,
                      tension: 0.4,
                      lineWidth: 1,
                      fill: 0.5
                  }
              },
              grid: {
                  borderColor: '#eee',
                  borderWidth: 1,
                  hoverable: true,
                  backgroundColor: '#fcfcfc'
              },
              tooltip: true,
              tooltipOpts: {
                  content: function (label, x, y) { return x + ' : ' + y; }
              },
              xaxis: {
                  tickColor: '#fcfcfc',
                  mode: 'categories'
              },
              yaxis: {
                  min: 0,
                  max: 150, // optional: use it for a clear represetation
                  tickColor: '#eee',
                  position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                  tickFormatter: function (v) {
                      return v/* + ' visitors'*/;
                  }
              },
              shadowSize: 0
          };

          // AREA
          // -----------------------------------
          vm.areaData = ChartData.load('server/chart/area.json');
          vm.areaOptions = {
              series: {
                  lines: {
                      show: true,
                      fill: 0.8
                  },
                  points: {
                      show: true,
                      radius: 4
                  }
              },
              grid: {
                  borderColor: '#eee',
                  borderWidth: 1,
                  hoverable: true,
                  backgroundColor: '#fcfcfc'
              },
              tooltip: true,
              tooltipOpts: {
                  content: function (label, x, y) { return x + ' : ' + y; }
              },
              xaxis: {
                  tickColor: '#fcfcfc',
                  mode: 'categories'
              },
              yaxis: {
                  min: 0,
                  tickColor: '#eee',
                  position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                  tickFormatter: function (v) {
                      return v + ' visitors';
                  }
              },
              shadowSize: 0
          };

          // LINE
          // -----------------------------------
          vm.lineData = ChartData.load('server/chart/line.json');
          vm.lineOptions = {
              series: {
                  lines: {
                      show: true,
                      fill: 0.01
                  },
                  points: {
                      show: true,
                      radius: 4
                  }
              },
              grid: {
                  borderColor: '#eee',
                  borderWidth: 1,
                  hoverable: true,
                  backgroundColor: '#fcfcfc'
              },
              tooltip: true,
              tooltipOpts: {
                  content: function (label, x, y) { return x + ' : ' + y; }
              },
              xaxis: {
                  tickColor: '#eee',
                  mode: 'categories'
              },
              yaxis: {
                  position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                  tickColor: '#eee'
              },
              shadowSize: 0
          };

          // PIE
          // -----------------------------------
          vm.pieData = [{
              "label": "jQuery",
              "color": "#4acab4",
              "data": 30
            }, {
              "label": "CSS",
              "color": "#ffea88",
              "data": 40
            }, {
              "label": "LESS",
              "color": "#ff8153",
              "data": 90
            }, {
              "label": "SASS",
              "color": "#878bb6",
              "data": 75
            }, {
              "label": "Jade",
              "color": "#b2d767",
              "data": 120
            }];
          // Direct data temporarily added until fix: https://github.com/flot/flot/pull/1462
          // ChartData.load('server/chart/pie.json');

          vm.pieOptions = {
              series: {
                  pie: {
                      show: true,
                      innerRadius: 0,
                      label: {
                          show: true,
                          radius: 0.8,
                          formatter: function (label, series) {
                              return '<div class="flot-pie-label">' +
                              //label + ' : ' +
                              Math.round(series.percent) +
                              '%</div>';
                          },
                          background: {
                              opacity: 0.8,
                              color: '#222'
                          }
                      }
                  }
              }
          };

          // DONUT
          // -----------------------------------
          vm.donutData = [ { "color" : "#39C558",
                "data" : 60,
                "label" : "Coffee"
              },
              { "color" : "#00b4ff",
                "data" : 90,
                "label" : "CSS"
              },
              { "color" : "#FFBE41",
                "data" : 50,
                "label" : "LESS"
              },
              { "color" : "#ff3e43",
                "data" : 80,
                "label" : "Jade"
              },
              { "color" : "#937fc7",
                "data" : 116,
                "label" : "AngularJS"
              }
            ];
          // Direct data temporarily added until fix: https://github.com/flot/flot/pull/1462
          // ChartData.load('server/chart/donut.json');

          vm.donutOptions = {
              series: {
                  pie: {
                      show: true,
                      innerRadius: 0.5 // This makes the donut shape
                  }
              }
          };

          // REALTIME
          // -----------------------------------
          vm.realTimeOptions = {
              series: {
                lines: { show: true, fill: true, fillColor:  { colors: ['#a0e0f3', '#23b7e5'] } },
                shadowSize: 0 // Drawing is faster without shadows
              },
              grid: {
                  show:false,
                  borderWidth: 0,
                  minBorderMargin: 20,
                  labelMargin: 10
              },
              xaxis: {
                tickFormatter: function() {
                    return '';
                }
              },
              yaxis: {
                  min: 0,
                  max: 110
              },
              legend: {
                  show: true
              },
              colors: ['#23b7e5']
          };

          // Generate random data for realtime demo
          var data = [], totalPoints = 300;

          update();

          function getRandomData() {
            if (data.length > 0)
              data = data.slice(1);
            // Do a random walk
            while (data.length < totalPoints) {
              var prev = data.length > 0 ? data[data.length - 1] : 50,
                y = prev + Math.random() * 10 - 5;
              if (y < 0) {
                y = 0;
              } else if (y > 100) {
                y = 100;
              }
              data.push(y);
            }
            // Zip the generated y values with the x values
            var res = [];
            for (var i = 0; i < data.length; ++i) {
              res.push([i, data[i]]);
            }
            return [res];
          }
          function update() {
            vm.realTimeData = getRandomData();
            $timeout(update, 30);
          }
          // end random data generation


          // PANEL REFRESH EVENTS
          // -----------------------------------

          $scope.$on('panel-refresh', function(event, id) {

            console.log('Simulating chart refresh during 3s on #'+id);

            // Instead of timeout you can request a chart data
            $timeout(function(){

              // directive listen for to remove the spinner
              // after we end up to perform own operations
              $scope.$broadcast('removeSpinner', id);

              console.log('Refreshed #' + id);

            }, 3000);

          });


          // PANEL DISMISS EVENTS
          // -----------------------------------

          // Before remove panel
          $scope.$on('panel-remove', function(event, id, deferred){

            console.log('Panel #' + id + ' removing');

            // Here is obligatory to call the resolve() if we pretend to remove the panel finally
            // Not calling resolve() will NOT remove the panel
            // It's up to your app to decide if panel should be removed or not
            deferred.resolve();

          });

          // Panel removed ( only if above was resolved() )
          $scope.$on('panel-removed', function(event, id){

            console.log('Panel #' + id + ' removed');

          });

        }
    }
})();

/**=========================================================
 * Module: flot.js
 * Initializes the Flot chart plugin and handles data refresh
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        .directive('flot', flot);

    flot.$inject = ['$http', '$timeout'];
    function flot ($http, $timeout) {

        var directive = {
          restrict: 'EA',
          template: '<div></div>',
          scope: {
            dataset: '=?',
            options: '=',
            series: '=',
            callback: '=',
            src: '='
          },
          link: link
        };
        return directive;

        function link(scope, element, attrs) {
          var height, plot, plotArea, width;
          var heightDefault = 220;

          plot = null;

          width = attrs.width || '100%';
          height = attrs.height || heightDefault;

          plotArea = $(element.children()[0]);
          plotArea.css({
            width: width,
            height: height
          });

          function init() {
            var plotObj;
            if(!scope.dataset || !scope.options) return;
            plotObj = $.plot(plotArea, scope.dataset, scope.options);
            scope.$emit('plotReady', plotObj);
            if (scope.callback) {
              scope.callback(plotObj, scope);
            }

            return plotObj;
          }

          function onDatasetChanged(dataset) {
            if (plot) {
              plot.setData(dataset);
              plot.setupGrid();
              return plot.draw();
            } else {
              plot = init();
              onSerieToggled(scope.series);
              return plot;
            }
          }
          scope.$watchCollection('dataset', onDatasetChanged, true);

          function onSerieToggled (series) {
            if( !plot || !series ) return;
            var someData = plot.getData();
            for(var sName in series) {
              angular.forEach(series[sName], toggleFor(sName));
            }
            
            plot.setData(someData);
            plot.draw();
            
            function toggleFor(sName) {
              return function (s, i){
                if(someData[i] && someData[i][sName])
                  someData[i][sName].show = s;
              };
            }
          }
          scope.$watch('series', onSerieToggled, true);
          
          function onSrcChanged(src) {

            if( src ) {

              $http.get(src)
                .success(function (data) {

                  $timeout(function(){
                    scope.dataset = data;
                  });

              }).error(function(){
                $.error('Flot chart: Bad request.');
              });
              
            }
          }
          scope.$watch('src', onSrcChanged);

        }
    }


})();

/**=========================================================
 * Module: morris.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        .controller('ChartMorrisController', ChartMorrisController);

    ChartMorrisController.$inject = ['$timeout', 'Colors'];
    function ChartMorrisController($timeout, Colors) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
         vm.chartdata = [
              { y: '2006', a: 100, b: 90 },
              { y: '2007', a: 75,  b: 65 },
              { y: '2008', a: 50,  b: 40 },
              { y: '2009', a: 75,  b: 65 },
              { y: '2010', a: 50,  b: 40 },
              { y: '2011', a: 75,  b: 65 },
              { y: '2012', a: 100, b: 90 }
          ];

          /* test data update
          $timeout(function(){
            vm.chartdata[0].a = 50;
            vm.chartdata[0].b = 50;
          }, 3000); */

          vm.donutdata = [
            {label: 'Download Sales', value: 12},
            {label: 'In-Store Sales',value: 30},
            {label: 'Mail-Order Sales', value: 20}
          ];

          vm.donutOptions = {
            Colors: [ Colors.byName('danger'), Colors.byName('yellow'), Colors.byName('warning') ],
            resize: true
          };

          vm.barOptions = {
            xkey: 'y',
            ykeys: ['a', 'b'],
            labels: ['Series A', 'Series B'],
            xLabelMargin: 2,
            barColors: [ Colors.byName('info'), Colors.byName('danger') ],
            resize: true
          };

          vm.lineOptions = {
            xkey: 'y',
            ykeys: ['a', 'b'],
            labels: ['Serie A', 'Serie B'],
            lineColors: ['#31C0BE', '#7a92a3'],
            resize: true
          };

          vm.areaOptions = {
            xkey: 'y',
            ykeys: ['a', 'b'],
            labels: ['Serie A', 'Serie B'],
            lineColors: [ Colors.byName('purple'), Colors.byName('info') ],
            resize: true
          };

        }
    }
})();

/**=========================================================
 * Module: morris.js
 * AngularJS Directives for Morris Charts
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        .directive('morrisBar',   morrisChart('Bar')   )
        .directive('morrisDonut', morrisChart('Donut') )
        .directive('morrisLine',  morrisChart('Line')  )
        .directive('morrisArea',  morrisChart('Area')  );

    function morrisChart(type) {
      return function () {
        return {
          restrict: 'EA',
          scope: {
            morrisData: '=',
            morrisOptions: '='
          },
          link: function($scope, element) {
            // start ready to watch for changes in data
            $scope.$watch('morrisData', function(newVal) {
              if (newVal) {
                $scope.morrisInstance.setData(newVal);
                $scope.morrisInstance.redraw();
              }
            }, true);
            // the element that contains the chart
            $scope.morrisOptions.element = element;
            // If data defined copy to options
            if($scope.morrisData)
              $scope.morrisOptions.data = $scope.morrisData;
            // Init chart
            $scope.morrisInstance = new Morris[type]($scope.morrisOptions);

          }
        };
      };
    }

})();

/**=========================================================
 * Module: PieChartsController.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        .controller('PieChartsController', PieChartsController);

    /*jshint -W069*/
    PieChartsController.$inject = ['Colors'];

    function PieChartsController(Colors) {
        var vm = this;

        activate();

        ////////////////

        function activate() {

          // KNOB Charts

          vm.knobLoaderData1 = 80;
          vm.knobLoaderOptions1 = {
              width: '50%', // responsive
              displayInput: true,
              fgColor: Colors.byName('info')
            };

          vm.knobLoaderData2 = 45;
          vm.knobLoaderOptions2 = {
              width: '50%', // responsive
              displayInput: true,
              fgColor: Colors.byName('purple'),
              readOnly : true
            };

          vm.knobLoaderData3 = 30;
          vm.knobLoaderOptions3 = {
              width: '50%', // responsive
              displayInput: true,
              fgColor: Colors.byName('pink'),
              displayPrevious : true,
              thickness : 0.1,
              lineCap : 'round'
            };

          vm.knobLoaderData4 = 20;
          vm.knobLoaderOptions4 = {
              width: '50%', // responsive
              displayInput: true,
              fgColor: Colors.byName('info'),
              bgColor: Colors.byName('gray'),
              angleOffset: -125,
              angleArc: 250
            };

          // Easy Pie Charts

          vm.piePercent1 = 85;
          vm.piePercent2 = 45;
          vm.piePercent3 = 25;
          vm.piePercent4 = 60;

          vm.pieOptions1 = {
              animate:{
                  duration: 800,
                  enabled: true
              },
              barColor: Colors.byName('success'),
              trackColor: false,
              scaleColor: false,
              lineWidth: 10,
              lineCap: 'circle'
          };

          vm.pieOptions2= {
              animate:{
                  duration: 800,
                  enabled: true
              },
              barColor: Colors.byName('warning'),
              trackColor: false,
              scaleColor: false,
              lineWidth: 4,
              lineCap: 'circle'
          };

          vm.pieOptions3 = {
              animate:{
                  duration: 800,
                  enabled: true
              },
              barColor: Colors.byName('danger'),
              trackColor: false,
              scaleColor: Colors.byName('gray'),
              lineWidth: 15,
              lineCap: 'circle'
          };

          vm.pieOptions4 = {
              animate:{
                  duration: 800,
                  enabled: true
              },
              barColor: Colors.byName('danger'),
              trackColor: Colors.byName('yellow'),
              scaleColor: Colors.byName('gray-dark'),
              lineWidth: 15,
              lineCap: 'circle'
          };

          vm.randomize = function(type) {
            if ( type === 'easy') {
              vm.piePercent1 = random();
              vm.piePercent2 = random();
              vm.piePercent3 = random();
              vm.piePercent4 = random();
            }
            if ( type === 'knob') {
              vm.knobLoaderData1 = random();
              vm.knobLoaderData2 = random();
              vm.knobLoaderData3 = random();
              vm.knobLoaderData4 = random();
            }
          }

          function random() { return Math.floor((Math.random() * 100) + 1); }

        }
    }
})();

/**=========================================================
 * Module: rickshaw.js
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.charts')
        .controller('ChartRickshawController', ChartRickshawController);

    function ChartRickshawController() {
        var vm = this;

        activate();

        ////////////////

        function activate() {

          vm.renderers = [{
                  id: 'area',
                  name: 'Area'
              }, {
                  id: 'line',
                  name: 'Line'
              }, {
                  id: 'bar',
                  name: 'Bar'
              }, {
                  id: 'scatterplot',
                  name: 'Scatterplot'
              }];

          vm.palettes = [
              'spectrum14',
              'spectrum2000',
              'spectrum2001',
              'colorwheel',
              'cool',
              'classic9',
              'munin'
          ];

          vm.rendererChanged = function(id) {
              vm['options' + id] = {
                  renderer: vm['renderer' + id].id
              };
          };

          vm.paletteChanged = function(id) {
              vm['features' + id] = {
                  palette: vm['palette' + id]
              };
          };

          vm.changeSeriesData = function(id) {
              var seriesList = [];
              for (var i = 0; i < 3; i++) {
                  var series = {
                      name: 'Series ' + (i + 1),
                      data: []
                  };
                  for (var j = 0; j < 10; j++) {
                      series.data.push({x: j, y: Math.random() * 20});
                  }
                  seriesList.push(series);
                  vm['series' + id][i] = series;
              }
              //vm['series' + id] = seriesList;
          };

          vm.series0 = [];

          vm.options0 = {
            renderer: 'area'
          };

          vm.renderer0 = vm.renderers[0];
          vm.palette0 = vm.palettes[0];

          vm.rendererChanged(0);
          vm.paletteChanged(0);
          vm.changeSeriesData(0);  

          // Graph 2

          var seriesData = [ [], [], [] ];
          var random = new Rickshaw.Fixtures.RandomData(150);

          for (var i = 0; i < 150; i++) {
            random.addData(seriesData);
          }

          vm.series2 = [
            {
              color: '#c05020',
              data: seriesData[0],
              name: 'New York'
            }, {
              color: '#30c020',
              data: seriesData[1],
              name: 'London'
            }, {
              color: '#6060c0',
              data: seriesData[2],
              name: 'Tokyo'
            }
          ];

          vm.options2 = {
            renderer: 'area'
          };

        }
    }
})();

/**=========================================================
 * Module: sparkline.js
 * SparkLines Mini Charts
 =========================================================*/
 
(function() {
    'use strict';

    angular
        .module('app.charts')
        .directive('sparkline', sparkline);

    function sparkline () {
        var directive = {
            restrict: 'EA',
            scope: {
              'sparkline': '='
            },
            controller: Controller
        };
        return directive;

    }
    Controller.$inject = ['$scope', '$element', '$timeout', '$window'];
    function Controller($scope, $element, $timeout, $window) {
      var runSL = function(){
        initSparLine();
      };

      $timeout(runSL);
  
      function initSparLine() {
        var options = $scope.sparkline,
            data = $element.data();
        
        if(!options) // if no scope options, try with data attributes
          options = data;
        else
          if(data) // data attributes overrides scope options
            options = angular.extend({}, options, data);

        options.type = options.type || 'bar'; // default chart is bar
        options.disableHiddenCheck = true;

        $element.sparkline('html', options);

        if(options.resize) {
          $($window).resize(function(){
            $element.sparkline('html', options);
          });
        }
      }

    }
    

})();

(function() {
    'use strict';

    angular
        .module('app.checkauth')
        .factory(
            'checkauth',
            ['$rootScope', '$location', 'session', 
                function ($rootScope, $location, session) {
                    function checkAuth() {
                        var publicRoutes = [
                            '/page/login',
                            '/page/register',
                            '/page/recover',
                            '/page/lock',
                            '/page/404',
                        ];

                        $rootScope.$on('$locationChangeStart', function (event, next, current) {
                            var nextRoute = next.split('#');
                            if ((publicRoutes.indexOf(nextRoute[1]) === -1 ) &&
                                (!session.isAuthenticated)) {
                                event.preventDefault;
                                $location.path("/page/login");
                            }
                        });

                        // populate current user
                        $rootScope.$watch(
                            function() { 
                                return session.token; 
                            }, 
                            function () { 
                                if (session.isAuthenticated) {
                                    $rootScope.currentUser = session.username;
                                    $rootScope.isAuthenticated = true; 
                                } else {
                                    $rootScope.currentUser = null;
                                    $rootScope.isAuthenticated = false; 
                                }
                            }
                        );
                    }

                    return checkAuth;
                }
            ]
        );
})();

(function() {
    'use strict';

    angular
        .module('app.colors')
        .constant('APP_COLORS', {
          'primary':                '#5d9cec',
          'success':                '#27c24c',
          'info':                   '#23b7e5',
          'warning':                '#ff902b',
          'danger':                 '#f05050',
          'inverse':                '#131e26',
          'green':                  '#37bc9b',
          'pink':                   '#f532e5',
          'purple':                 '#7266ba',
          'dark':                   '#3a3f51',
          'yellow':                 '#fad732',
          'gray-darker':            '#232735',
          'gray-dark':              '#3a3f51',
          'gray':                   '#dde6e9',
          'gray-light':             '#e4eaec',
          'gray-lighter':           '#edf1f2'
        })
        ;
})();
/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.colors')
        .service('Colors', Colors);

    Colors.$inject = ['APP_COLORS'];
    function Colors(APP_COLORS) {
        this.byName = byName;

        ////////////////

        function byName(name) {
          return (APP_COLORS[name] || '#fff');
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .config(coreConfig);

    coreConfig.$inject = [
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        '$animateProvider',
        '$httpProvider',
        'RestangularProvider',
        'APP_CONFIG'
    ];
    function coreConfig(
        $controllerProvider,
        $compileProvider,
        $filterProvider,
        $provide,
        $animateProvider,
        $httpProvider,
        RestangularProvider,
        APP_CONFIG){

      var core = angular.module('app.core');
      // registering components after bootstrap
      core.controller = $controllerProvider.register;
      core.directive  = $compileProvider.directive;
      core.filter     = $filterProvider.register;
      core.factory    = $provide.factory;
      core.service    = $provide.service;
      core.constant   = $provide.constant;
      core.value      = $provide.value;

      // Disables animation on items with class .ng-no-animation
      $animateProvider.classNameFilter(/^((?!(ng-no-animation)).)*$/);
        
      // restangular config
      RestangularProvider.setBaseUrl(APP_CONFIG.API.full);
      RestangularProvider.setRestangularFields({
        id: '_id',
        selfLink: 'self.href'
      });
      RestangularProvider.addFullRequestInterceptor(function(element, operation, route, url, headers) {
        if ((operation === 'patch') || (operation === 'put')) {
          delete element._id;
          delete element._created;
          delete element._updated;
          delete element._links;
          delete element._etag;
        }
        return {
          element: element
        }
      });
      RestangularProvider.setResponseExtractor(function(response, operation) {
        if (operation === 'getList') {
            var results = response._items;
            results._meta = response._meta;
            return response._items;
        }
        return response;
      });

      // intercept to add auth token 
      $httpProvider.interceptors.push('authInterceptor');
    }

})();

/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('APP_MEDIAQUERY', {
          'desktopLG':             1200,
          'desktop':                992,
          'tablet':                 768,
          'mobile':                 480
        })
        .constant('APP_CONFIG', {
          // API urls
          API: {
              rootURI: 'https://tandem.dev/api',
              endpoint: '/api/v1/',
              full: 'https://tandem.dev/api/v1'
          },
          mymemory: {
              rootURI: 'https://api.mymemory.translated.net/'
          },
          duolingo: {
              apiURI: 'https://api.duolingo.com/',
              dictURI: 'https://d2.duolingo.com/api/1/dictionary/',
              ttsURI: 'https://d7mj4aqfscim2.cloudfront.net/'
          },
          gcse: {
              apiURI: 'https://www.googleapis.com/customsearch/v1',
              apiKey: 'AIzaSyCqtneeGqDwpeWJHEvm2daOBNrAmJOdNn0&cx=006561381899366895267:dtmrsefnen0'
          },
          leo: {
            linkURI: 'https://dict.leo.org/ende/index_de.html#/search=' 
          },
          // languages 
          languages: [
              { 
                  text: {
                      translations: {
                          en: 'English',
                          de: 'Englisch',
                          es: 'inglés'
                      }
                  },
                  code: 'en'
              },
              { 
                  text: {
                      translations: {
                          en: 'German',
                          de: 'Deutsch',
                          es: 'alemán'
                      }
                  },
                  code: 'de'
              },
              { 
                  text: {
                      translations: {
                          en: 'Spanish',
                          de: 'Spanisch',
                          es: 'español'
                      }
                  },
                  code: 'es'
              }
          ]
          // end languages 
        })
      ;

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    appRun.$inject = ['$rootScope', '$state', '$stateParams',  '$window', '$templateCache', 'Colors', 'checkauth'];
    
    function appRun($rootScope, $state, $stateParams, $window, $templateCache, Colors, checkauth) {
    
      // check auth, redirect to login if not authorized 
      checkauth();
 
      // Set reference to access them from any scope
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.$storage = $window.localStorage;

      // Uncomment this to disable template cache
      /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          if (typeof(toState) !== 'undefined'){
            $templateCache.remove(toState.templateUrl);
          }
      });*/

      // Allows to use branding color with interpolation
      // {{ colorByName('primary') }}
      $rootScope.colorByName = Colors.byName;

      // cancel click event easily
      $rootScope.cancel = function($event) {
        $event.stopPropagation();
      };

      // Hooks Example
      // ----------------------------------- 

      // Hook not found
      $rootScope.$on('$stateNotFound',
        function(event, unfoundState/*, fromState, fromParams*/) {
            console.log(unfoundState.to); // "lazy.state"
            console.log(unfoundState.toParams); // {a:1, b:2}
            console.log(unfoundState.options); // {inherit:false} + default options
        });
      // Hook error
      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error){
          console.log(error);
        });
      // Hook success
      $rootScope.$on('$stateChangeSuccess',
        function(/*event, toState, toParams, fromState, fromParams*/) {
          // display new view from top
          $window.scrollTo(0, 0);
          // Save the route title
          $rootScope.currTitle = $state.current.title;
        });

      // Load a title dynamically
      $rootScope.currTitle = $state.current.title;
      $rootScope.pageTitle = function() {
        var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
        document.title = title;
        return title;
      };      

    }

})();


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

(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardV2Controller', DashboardV2Controller);

    DashboardV2Controller.$inject = ['$rootScope', '$scope', '$state'];
    function DashboardV2Controller($rootScope, $scope, $state) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
          
          // Change layout mode
          if( $state.includes('app-h') ) {
            // Setup layout horizontal for demo
            $rootScope.app.layout.horizontal = true;
            $scope.$on('$destroy', function(){
                $rootScope.app.layout.horizontal = false;
            });            
          }
          else {
            $rootScope.app.layout.isCollapsed = true;
          }

          // BAR STACKED
          // ----------------------------------- 
          vm.barStackedOptions = {
              series: {
                  stack: true,
                  bars: {
                      align: 'center',
                      lineWidth: 0,
                      show: true,
                      barWidth: 0.6,
                      fill: 0.9
                  }
              },
              grid: {
                  borderColor: '#eee',
                  borderWidth: 1,
                  hoverable: true,
                  backgroundColor: '#fcfcfc'
              },
              tooltip: true,
              tooltipOpts: {
                  content: function (label, x, y) { return x + ' : ' + y; }
              },
              xaxis: {
                  tickColor: '#fcfcfc',
                  mode: 'categories'
              },
              yaxis: {
                  min: 0,
                  max: 200, // optional: use it for a clear represetation
                  position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                  tickColor: '#eee'
              },
              shadowSize: 0
          };

          // SPLINE
          // ----------------------------------- 

          vm.splineOptions = {
              series: {
                  lines: {
                      show: false
                  },
                  points: {
                      show: true,
                      radius: 4
                  },
                  splines: {
                      show: true,
                      tension: 0.4,
                      lineWidth: 1,
                      fill: 0.5
                  }
              },
              grid: {
                  borderColor: '#eee',
                  borderWidth: 1,
                  hoverable: true,
                  backgroundColor: '#fcfcfc'
              },
              tooltip: true,
              tooltipOpts: {
                  content: function (label, x, y) { return x + ' : ' + y; }
              },
              xaxis: {
                  tickColor: '#fcfcfc',
                  mode: 'categories'
              },
              yaxis: {
                  min: 0,
                  max: 150, // optional: use it for a clear represetation
                  tickColor: '#eee',
                  position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                  tickFormatter: function (v) {
                      return v/* + ' visitors'*/;
                  }
              },
              shadowSize: 0
          };
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardV3Controller', DashboardV3Controller);

    DashboardV3Controller.$inject = ['$rootScope'];
    function DashboardV3Controller($rootScope) {
        var vm = this;

        activate();

        ////////////////

        function activate() {

          // SPLINE
          // ----------------------------------- 

          vm.splineOptions = {
              series: {
                  lines: {
                      show: false
                  },
                  points: {
                      show: true,
                      radius: 4
                  },
                  splines: {
                      show: true,
                      tension: 0.4,
                      lineWidth: 1,
                      fill: 0.5
                  }
              },
              grid: {
                  borderColor: '#eee',
                  borderWidth: 1,
                  hoverable: true,
                  backgroundColor: '#fcfcfc'
              },
              tooltip: true,
              tooltipOpts: {
                  content: function (label, x, y) { return x + ' : ' + y; }
              },
              xaxis: {
                  tickColor: '#fcfcfc',
                  mode: 'categories'
              },
              yaxis: {
                  min: 0,
                  max: 150, // optional: use it for a clear represetation
                  tickColor: '#eee',
                  position: ($rootScope.app.layout.isRTL ? 'right' : 'left'),
                  tickFormatter: function (v) {
                      return v/* + ' visitors'*/;
                  }
              },
              shadowSize: 0
          };


          vm.seriesData = {
            'CA': 11100,   // Canada
            'DE': 2510,    // Germany
            'FR': 3710,    // France
            'AU': 5710,    // Australia
            'GB': 8310,    // Great Britain
            'RU': 9310,    // Russia
            'BR': 6610,    // Brazil
            'IN': 7810,    // India
            'CN': 4310,    // China
            'US': 839,     // USA
            'SA': 410      // Saudi Arabia
          };
          
          vm.markersData = [
            { latLng:[41.90, 12.45],  name:'Vatican City'          },
            { latLng:[43.73, 7.41],   name:'Monaco'                },
            { latLng:[-0.52, 166.93], name:'Nauru'                 },
            { latLng:[-8.51, 179.21], name:'Tuvalu'                },
            { latLng:[7.11,171.06],   name:'Marshall Islands'      },
            { latLng:[17.3,-62.73],   name:'Saint Kitts and Nevis' },
            { latLng:[3.2,73.22],     name:'Maldives'              },
            { latLng:[35.88,14.5],    name:'Malta'                 },
            { latLng:[41.0,-71.06],   name:'New England'           },
            { latLng:[12.05,-61.75],  name:'Grenada'               },
            { latLng:[13.16,-59.55],  name:'Barbados'              },
            { latLng:[17.11,-61.85],  name:'Antigua and Barbuda'   },
            { latLng:[-4.61,55.45],   name:'Seychelles'            },
            { latLng:[7.35,134.46],   name:'Palau'                 },
            { latLng:[42.5,1.51],     name:'Andorra'               }
          ];
        }
    }
})();
(function() {
    'use strict';

    /* duolingo service. */
    angular.module('app.duolingo').service('duolingo', [ 
      '$q',
      '$http',
      '$localStorage',
      'APP_CONFIG',
      'session',
      function duolingo($q, $http, $localStorage, APP_CONFIG, session) {
        var self = this;

        self.getTextHints = function (text, from, to) {
          var deferedHints = $q.defer();
          var url = APP_CONFIG.duolingo.dictURI + 'hints/';
          var cacheKey = 'dl-' + text + '-' + from + '-' + to;

          url += from + '/' + to;
          url += '?sentence=' + text + '&callback=JSON_CALLBACK';

          // check local cache first
          if ($localStorage[cacheKey]) {
            deferedHints.resolve(self.parseHints($localStorage[cacheKey]));
          } else {
              // make the api call
              $http({
                method: 'JSONP',
                url: url,
                transformRequest: function(data, headersGetter) {
                  var headers = headersGetter();
                  delete headers['Authorization'];
                  return headers;
                }
              }).then(function (response) {
                if (!response.data.tokens) {
                  deferedHints.reject();
                } else {
                  // save to browser cache
                  $localStorage[cacheKey] = response;
                  deferedHints.resolve(self.parseHints(response));
                }
              }, function (response) {
                deferedHints.reject();
              });
          }

          return deferedHints.promise;
        };

        self.parseHints = function (hints) {
          var parsedHints = {};
          var oWords = 0;

          angular.forEach(hints.data.tokens, function(word) {
            var oWord = word.value;
            var table = (word.hint_table) ? word.hint_table : null;
            var totalRows = (word.hint_table) ? word.hint_table.rows.total : 0;

            if (table) {
              // do we have results for this word?
              var rows = (table.rows.length) ? table.rows : null;
              if (rows) {
                angular.forEach(rows, function(row) {
                  var cells = (row.cells.length) ? row.cells : null;
                  if (cells) {
                    var tWord = (cells[0]) ? cells[0].hint : null;
                    if (parsedHints[oWord]) {
                      parsedHints[oWord].push(tWord);
                    } else {    
                      parsedHints[oWord] = [];
                      parsedHints[oWord].push(tWord);
                    }
                  }
                });
              }
            }
          });

          return parsedHints;
        };
      }
    ]);
})();

(function() {
    'use strict';

    /* duolingo service. */
    angular.module('app.google').service('googleSearch', [ 
      '$q',
      '$http',
      '$localStorage',
      'APP_CONFIG',
      'session',
      function googleSearch($q, $http, $localStorage, APP_CONFIG, session) {
        var self = this;

        self.getSearchResults = function (text) {
          var deferedResults = $q.defer();
          var url = APP_CONFIG.gcse.apiURI + '?key=' + APP_CONFIG.gcse.apiKey + '&q=' + text;
          var cacheKey = 'gsearch-' + url;

          if ($localStorage[cacheKey]) {
            deferedResults.resolve($localStorage[cacheKey]);
          } else {
            $http({
              method: 'GET',
              url: url,
              headers: { 'Accept': 'application/json, text/plain, */*' }
            }).then(function (response) {
              if (!response.data.items) {
                deferedResults.reject();
              } else {
                $localStorage[cacheKey] = response.data.items; 
                deferedResults.resolve(response.data.items);
              }
            }, function (response) {
              deferedResults.reject();
            });
          }

          return deferedResults.promise;
        };

        // TODO: use fileType to limit search to only
        // png, jpg, and jpeg
        self.getImageResults = function (text) {
          var deferedResults = $q.defer();
          var imgType='photo';
          var imgSize='medium';
          var fileType='png';
          var url = APP_CONFIG.gcse.apiURI + '?key=' + APP_CONFIG.gcse.apiKey + '&q=' + text +
            '&searchType=image&imgType=' + imgType + '&imgSize=' + imgSize + '&fileType=' +
            fileType; // + '&rights=cc_publicdomain';
          var cacheKey = 'gsearch-' + url;

          if ($localStorage[cacheKey]) {
            deferedResults.resolve($localStorage[cacheKey]);
          } else {
            $http({
              method: 'GET',
              url: url,
              headers: { 'Accept': 'application/json, text/plain, */*' }
            }).then(function (response) {
              if (!response.data.items) {
                deferedResults.reject();
              } else {
                $localStorage[cacheKey] = response.data.items; 
                deferedResults.resolve(response.data.items);
              }
            }, function (response) {
              deferedResults.reject();
            });
          }

          return deferedResults.promise;
        };

      }
    ]);
})();

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

(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name tandem.controller:AddQuestionAudioModalController
     * @description
     * # ModalAddQuestionCtrl
     * Controller of the tandemWebApp
     */
    angular.module('app.images').controller('ImageSelectModalController', [
      '$scope',
      'session',
      'googleSearch',
      'referenceObject',
       function ImageSelectModalController(
        $scope,
        session,
        googleSearch,
        referenceObject) {
        var self = this;

        self.session = session;
        self.searchText = '';
        self.searchResults = [];

        if (referenceObject.route === 'questions') {
          self.question = referenceObject;
          self.searchText = self.question.text.translations[session.learning];
          googleSearch.getImageResults(self.searchText).then(function (results) {
            self.searchResults = results;
            // get results in speaking language
            self.searchText = self.question.text.translations[session.speaks];
            googleSearch.getImageResults(self.searchText).then(function (extraResults) {
              self.searchResults.concat(extraResults);
            });
          }, function() {
            console.log('error with google search request');
          });
        }

        if (referenceObject.route === 'tags') {
          self.tag = referenceObject;
          self.searchText = self.tag.text.translations[session.learning];
          googleSearch.getImageResults(self.searchText).then(function (results) {
            self.searchResults = results;
            // get results in speaking language
            self.searchText = self.tag.text.translations[session.speaks];
            googleSearch.getImageResults(self.searchText).then(function (extraResults) {
              self.searchResults.concat(extraResults);
            });
          }, function() {
            console.log('error with google search request');
          });
        }

      }
    ]);
})();

(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .config(lazyloadConfig);

    lazyloadConfig.$inject = ['$ocLazyLoadProvider', 'APP_REQUIRES'];
    function lazyloadConfig($ocLazyLoadProvider, APP_REQUIRES){

      // Lazy Load modules configuration
      $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: APP_REQUIRES.modules
      });

    }
})();
(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .constant('APP_REQUIRES', {
          // jQuery based and standalone scripts
          scripts: {
            'whirl':              ['vendor/whirl/dist/whirl.css'],
            'classyloader':       ['vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
            'animo':              ['vendor/animo.js/animo.js'],
            'fastclick':          ['vendor/fastclick/lib/fastclick.js'],
            'modernizr':          ['vendor/modernizr/modernizr.custom.js'],
            'animate':            ['vendor/animate.css/animate.min.css'],
            'skycons':            ['vendor/skycons/skycons.js'],
            'icons':              ['vendor/fontawesome/css/font-awesome.min.css',
                                   'vendor/simple-line-icons/css/simple-line-icons.css'],
            'weather-icons':      ['vendor/weather-icons/css/weather-icons.min.css',
                                   'vendor/weather-icons/css/weather-icons-wind.min.css'],
            'sparklines':         ['vendor/sparkline/index.js'],
            'wysiwyg':            ['vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                                   'vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
            'slimscroll':         ['vendor/slimScroll/jquery.slimscroll.min.js'],
            'screenfull':         ['vendor/screenfull/dist/screenfull.js'],
            'vector-map':         ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                                   'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'],
            'vector-map-maps':    ['vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                                   'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'],
            'loadGoogleMapsJS':   ['vendor/load-google-maps/load-google-maps.js'],
            'flot-chart':         ['vendor/Flot/jquery.flot.js'],
            'flot-chart-plugins': ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                                   'vendor/Flot/jquery.flot.resize.js',
                                   'vendor/Flot/jquery.flot.pie.js',
                                   'vendor/Flot/jquery.flot.time.js',
                                   'vendor/Flot/jquery.flot.categories.js',
                                   'vendor/flot-spline/js/jquery.flot.spline.min.js'],
                                  // jquery core and widgets
            'jquery-ui':          ['vendor/jquery-ui/ui/core.js',
                                   'vendor/jquery-ui/ui/widget.js'],
                                   // loads only jquery required modules and touch support
            'jquery-ui-widgets':  ['vendor/jquery-ui/ui/core.js',
                                   'vendor/jquery-ui/ui/widget.js',
                                   'vendor/jquery-ui/ui/mouse.js',
                                   'vendor/jquery-ui/ui/draggable.js',
                                   'vendor/jquery-ui/ui/droppable.js',
                                   'vendor/jquery-ui/ui/sortable.js',
                                   'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'],
            'moment' :            ['vendor/moment/min/moment-with-locales.min.js'],
            'inputmask':          ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.js'],
            'flatdoc':            ['vendor/flatdoc/flatdoc.js'],
            'codemirror':         ['vendor/codemirror/lib/codemirror.js',
                                   'vendor/codemirror/lib/codemirror.css'],
            // modes for common web files
            'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
                                     'vendor/codemirror/mode/xml/xml.js',
                                     'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                                     'vendor/codemirror/mode/css/css.js'],
            'taginput' :          ['vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                                   'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'],
            'filestyle':          ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
            'parsley':            ['vendor/parsleyjs/dist/parsley.min.js'],
            'fullcalendar':       ['vendor/fullcalendar/dist/fullcalendar.min.js',
                                   'vendor/fullcalendar/dist/fullcalendar.css'],
            'gcal':               ['vendor/fullcalendar/dist/gcal.js'],
            'chartjs':            ['vendor/Chart.js/Chart.js'],
            'morris':             ['vendor/raphael/raphael.js',
                                   'vendor/morris.js/morris.js',
                                   'vendor/morris.js/morris.css'],
            'loaders.css':        ['vendor/loaders.css/loaders.css'],
            'spinkit':            ['vendor/spinkit/css/spinkit.css'],
            'wavesurfer.js':      ['vendor/wavesurfer.js/dist/wavesurfer.min.js']
          },
          // Angular based script (use the right module name)
          modules: [
            {name: 'toaster',                   files: ['vendor/angularjs-toaster/toaster.js',
                                                       'vendor/angularjs-toaster/toaster.css']},
            {name: 'localytics.directives',     files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js',
                                                       'vendor/chosen_v1.2.0/chosen.min.css',
                                                       'vendor/angular-chosen-localytics/chosen.js']},
            {name: 'ngDialog',                  files: ['vendor/ngDialog/js/ngDialog.min.js',
                                                       'vendor/ngDialog/css/ngDialog.min.css',
                                                       'vendor/ngDialog/css/ngDialog-theme-default.min.css'] },
            {name: 'ngWig',                     files: ['vendor/ngWig/dist/ng-wig.min.js'] },
            {name: 'ngTable',                   files: ['vendor/ng-table/dist/ng-table.min.js',
                                                        'vendor/ng-table/dist/ng-table.min.css']},
            {name: 'ngTableExport',             files: ['vendor/ng-table-export/ng-table-export.js']},
            {name: 'angularBootstrapNavTree',   files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                                                        'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']},
            {name: 'htmlSortable',              files: ['vendor/html.sortable/dist/html.sortable.js',
                                                        'vendor/html.sortable/dist/html.sortable.angular.js']},
            {name: 'xeditable',                 files: ['vendor/angular-xeditable/dist/js/xeditable.js',
                                                        'vendor/angular-xeditable/dist/css/xeditable.css']},
            {name: 'angularFileUpload',         files: ['vendor/angular-file-upload/dist/angular-file-upload.js']},
            {name: 'ngImgCrop',                 files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                                                        'vendor/ng-img-crop/compile/unminified/ng-img-crop.css']},
            {name: 'ui.select',                 files: ['vendor/angular-ui-select/dist/select.js',
                                                        'vendor/angular-ui-select/dist/select.css']},
            {name: 'ui.codemirror',             files: ['vendor/angular-ui-codemirror/ui-codemirror.js']},
            {name: 'angular-carousel',          files: ['vendor/angular-carousel/dist/angular-carousel.css',
                                                        'vendor/angular-carousel/dist/angular-carousel.js']},
            {name: 'infinite-scroll',           files: ['vendor/ngInfiniteScroll/build/ng-infinite-scroll.js']},
            {name: 'ui.bootstrap-slider',       files: ['vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                                                        'vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
                                                        'vendor/angular-bootstrap-slider/slider.js']},
            {name: 'ui.grid',                   files: ['vendor/angular-ui-grid/ui-grid.min.css',
                                                        'vendor/angular-ui-grid/ui-grid.min.js']},
            {name: 'textAngular',               files: ['vendor/textAngular/dist/textAngular.css',
                                                        'vendor/textAngular/dist/textAngular-rangy.min.js',
                                                        'vendor/textAngular/dist/textAngular-sanitize.js',
                                                        'vendor/textAngular/src/globals.js',
                                                        'vendor/textAngular/src/factories.js',
                                                        'vendor/textAngular/src/DOM.js',
                                                        'vendor/textAngular/src/validators.js',
                                                        'vendor/textAngular/src/taBind.js',
                                                        'vendor/textAngular/src/main.js',
                                                        'vendor/textAngular/dist/textAngularSetup.js'
                                                        ], serie: true},
            {name: 'angular-rickshaw',          files: ['vendor/d3/d3.min.js',
                                                        'vendor/rickshaw/rickshaw.js',
                                                        'vendor/rickshaw/rickshaw.min.css',
                                                        'vendor/angular-rickshaw/rickshaw.js'], serie: true},
            {name: 'angular-chartist',          files: ['vendor/chartist/dist/chartist.min.css',
                                                        'vendor/chartist/dist/chartist.js',
                                                        'vendor/angular-chartist.js/dist/angular-chartist.js'], serie: true},
            {name: 'ui.map',                    files: ['vendor/angular-ui-map/ui-map.js']},
            {name: 'datatables',                files: ['vendor/datatables/media/css/jquery.dataTables.css',
                                                        'vendor/datatables/media/js/jquery.dataTables.js',
                                                        'vendor/angular-datatables/dist/angular-datatables.js'], serie: true},
            {name: 'angular-jqcloud',           files: ['vendor/jqcloud2/dist/jqcloud.css',
                                                        'vendor/jqcloud2/dist/jqcloud.js',
                                                        'vendor/angular-jqcloud/angular-jqcloud.js']},
            {name: 'angularGrid',               files: ['vendor/ag-grid/dist/ag-grid.css',
                                                        'vendor/ag-grid/dist/ag-grid.js',
                                                        'vendor/ag-grid/dist/theme-dark.css',
                                                        'vendor/ag-grid/dist/theme-fresh.css']},
            {name: 'ng-nestable',               files: ['vendor/ng-nestable/src/angular-nestable.js',
                                                        'vendor/nestable/jquery.nestable.js']},
            {name: 'akoenig.deckgrid',          files: ['vendor/angular-deckgrid/angular-deckgrid.js']},
            {name: 'oitozero.ngSweetAlert',     files: ['vendor/sweetalert/dist/sweetalert.css',
                                                        'vendor/sweetalert/dist/sweetalert.min.js',
                                                        'vendor/angular-sweetalert/SweetAlert.js']},
            {name: 'bm.bsTour',                 files: ['vendor/bootstrap-tour/build/css/bootstrap-tour.css',
                                                        'vendor/bootstrap-tour/build/js/bootstrap-tour-standalone.js',
                                                        'vendor/angular-bootstrap-tour/dist/angular-bootstrap-tour.js'], serie: true},
            {name: 'ui.knob',                   files: ['vendor/angular-knob/src/angular-knob.js',
                                                        'vendor/jquery-knob/dist/jquery.knob.min.js']},
            {name: 'easypiechart',              files: ['vendor/jquery.easy-pie-chart/dist/angular.easypiechart.min.js']},
            {name: 'colorpicker.module',        files: ['vendor/angular-bootstrap-colorpicker/css/colorpicker.css',
                                                        'vendor/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js']},
            {name: 'bw.paging',                 files: ['vendor/angular-paging/dist/paging.min.js']}
          ]
        })
        ;

})();

(function() {
    'use strict';

    angular
        .module('app.loadingbar')
        .config(loadingbarConfig)
        ;
    loadingbarConfig.$inject = ['cfpLoadingBarProvider'];
    function loadingbarConfig(cfpLoadingBarProvider){
      cfpLoadingBarProvider.includeBar = true;
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.latencyThreshold = 500;
      cfpLoadingBarProvider.parentSelector = '.wrapper > section';
    }
})();
(function() {
    'use strict';

    angular
        .module('app.loadingbar')
        .run(loadingbarRun)
        ;
    loadingbarRun.$inject = ['$rootScope', '$timeout', 'cfpLoadingBar'];
    function loadingbarRun($rootScope, $timeout, cfpLoadingBar){

      // Loading bar transition
      // ----------------------------------- 
      var thBar;
      $rootScope.$on('$stateChangeStart', function() {
          if($('.wrapper > section').length) // check if bar container exists
            thBar = $timeout(function() {
              cfpLoadingBar.start();
            }, 0); // sets a latency Threshold
      });
      $rootScope.$on('$stateChangeSuccess', function(event) {
          event.targetScope.$watch('$viewContentLoaded', function () {
            $timeout.cancel(thBar);
            cfpLoadingBar.complete();
          });
      });

    }

})();
(function() {
    'use strict';

    angular
        .module('app.locale')
        .config(localeConfig)
        ;
    localeConfig.$inject = ['tmhDynamicLocaleProvider'];
    function localeConfig(tmhDynamicLocaleProvider){
  
      tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
      // tmhDynamicLocaleProvider.useStorage('$cookieStore');

    }
})();
/**=========================================================
 * Module: locale.js
 * Demo for locale settings
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.locale')
        .controller('LocalizationController', LocalizationController);

    LocalizationController.$inject = ['$rootScope', 'tmhDynamicLocale', '$locale'];
    function LocalizationController($rootScope, tmhDynamicLocale, $locale) {

        activate();

        ////////////////

        function activate() {
          $rootScope.availableLocales = {
            'en': 'English',
            'es': 'Spanish',
            'de': 'German',
            'fr': 'French',
            'ar': 'Arabic',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese'};
          
          $rootScope.model = {selectedLocale: 'en'};
          
          $rootScope.$locale = $locale;
          
          $rootScope.changeLocale = tmhDynamicLocale.set;
        }
    }
})();

/**=========================================================
 * Module: modals.js
 * Provides a simple way to implement bootstrap modals from templates
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.maps')
        .controller('ModalGmapController', ModalGmapController);

    ModalGmapController.$inject = ['$uibModal'];
    function ModalGmapController($uibModal) {
        var vm = this;

        activate();

        ////////////////

        function activate() {

          vm.open = function (size) {

            //var modalInstance =
            $uibModal.open({
              templateUrl: '/myModalContent.html',
              controller: ModalInstanceCtrl,
              size: size
            });
          };

          // Please note that $uibModalInstance represents a modal window (instance) dependency.
          // It is not the same as the $uibModal service used above.

          ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout'];
          function ModalInstanceCtrl($scope, $uibModalInstance, $timeout) {

            $uibModalInstance.opened.then(function () {
              var position = new google.maps.LatLng(33.790807, -117.835734);

              $scope.mapOptionsModal = {
                zoom: 14,
                center: position,
                mapTypeId: google.maps.MapTypeId.ROADMAP
              };

              // we use timeout to wait maps to be ready before add a markers
              $timeout(function(){
                // 1. Add a marker at the position it was initialized
                new google.maps.Marker({
                  map: $scope.myMapModal,
                  position: position
                });
                // 2. Trigger a resize so the map is redrawed
                google.maps.event.trigger($scope.myMapModal, 'resize');
                // 3. Move to the center if it is misaligned
                $scope.myMapModal.panTo(position);
              });

            });

            $scope.ok = function () {
              $uibModalInstance.close('closed');
            };

            $scope.cancel = function () {
              $uibModalInstance.dismiss('cancel');
            };

          }

        }
    }

})();


(function() {
    'use strict';

    angular
        .module('app.maps')
        .controller('GMapController', GMapController);

    GMapController.$inject = ['$timeout'];
    function GMapController($timeout) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
          var position = [
              new google.maps.LatLng(33.790807, -117.835734),
              new google.maps.LatLng(33.790807, -117.835734),
              new google.maps.LatLng(33.790807, -117.835734),
              new google.maps.LatLng(33.790807, -117.835734),
              new google.maps.LatLng(33.787453, -117.835858)
            ];
          
          vm.addMarker = addMarker;
          // we use timeout to wait maps to be ready before add a markers
          $timeout(function(){
            addMarker(vm.myMap1, position[0]);
            addMarker(vm.myMap2, position[1]);
            addMarker(vm.myMap3, position[2]);
            addMarker(vm.myMap5, position[3]);
          });

          vm.mapOptions1 = {
            zoom: 14,
            center: position[0],
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
          };

          vm.mapOptions2 = {
            zoom: 19,
            center: position[1],
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          vm.mapOptions3 = {
            zoom: 14,
            center: position[2],
            mapTypeId: google.maps.MapTypeId.SATELLITE
          };

          vm.mapOptions4 = {
            zoom: 14,
            center: position[3],
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          // for multiple markers
          $timeout(function(){
            addMarker(vm.myMap4, position[3]);
            addMarker(vm.myMap4, position[4]);
          });

          // custom map style
          var MapStyles = [{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#bdd1f9'}]},{'featureType':'all','elementType':'labels.text.fill','stylers':[{'color':'#334165'}]},{featureType:'landscape',stylers:[{color:'#e9ebf1'}]},{featureType:'road.highway',elementType:'geometry',stylers:[{color:'#c5c6c6'}]},{featureType:'road.arterial',elementType:'geometry',stylers:[{color:'#fff'}]},{featureType:'road.local',elementType:'geometry',stylers:[{color:'#fff'}]},{featureType:'transit',elementType:'geometry',stylers:[{color:'#d8dbe0'}]},{featureType:'poi',elementType:'geometry',stylers:[{color:'#cfd5e0'}]},{featureType:'administrative',stylers:[{visibility:'on'},{lightness:33}]},{featureType:'poi.park',elementType:'labels',stylers:[{visibility:'on'},{lightness:20}]},{featureType:'road',stylers:[{color:'#d8dbe0',lightness:20}]}];
          vm.mapOptions5 = {
            zoom: 14,
            center: position[3],
            styles: MapStyles,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
          };

          ///////////////
          
          function addMarker(map, position) {
            return new google.maps.Marker({
              map: map,
              position: position
            });
          }

        }
    }
})();

/**=========================================================
 * Module: vector-map.js.js
 * Init jQuery Vector Map plugin
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.maps')
        .directive('vectorMap', vectorMap);

    vectorMap.$inject = ['VectorMap'];
    function vectorMap (VectorMap) {
        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
              seriesData: '=',
              markersData: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
          
          var defaultColors = {
              markerColor:  '#23b7e5',      // the marker points
              bgColor:      'transparent',      // the background
              scaleColors:  ['#878c9a'],    // the color of the region in the serie
              regionFill:   '#bbbec6'       // the base region color
          };

          var mapHeight   = attrs.height || '300',
              options     = {
                markerColor:  attrs.markerColor  || defaultColors.markerColor,
                bgColor:      attrs.bgColor      || defaultColors.bgColor,
                scale:        attrs.scale        || 1,
                scaleColors:  attrs.scaleColors  || defaultColors.scaleColors,
                regionFill:   attrs.regionFill   || defaultColors.regionFill,
                mapName:      attrs.mapName      || 'world_mill_en'
              };
          
          element.css('height', mapHeight);
          
          VectorMap.init( element , options, scope.seriesData, scope.markersData);
        }
    }

})();

/**=========================================================
 * Module: vector-map.js
 * Services to initialize vector map plugin
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.maps')
        .service('VectorMap', VectorMap);

    function VectorMap() {
        this.init = init;

        ////////////////

        function init($element, opts, series, markers) {
          $element.vectorMap({
            map:             opts.mapName,
            backgroundColor: opts.bgColor,
            zoomMin:         1,
            zoomMax:         8,
            zoomOnScroll:    false,
            regionStyle: {
              initial: {
                'fill':           opts.regionFill,
                'fill-opacity':   1,
                'stroke':         'none',
                'stroke-width':   1.5,
                'stroke-opacity': 1
              },
              hover: {
                'fill-opacity': 0.8
              },
              selected: {
                fill: 'blue'
              },
              selectedHover: {
              }
            },
            focusOn:{ x:0.4, y:0.6, scale: opts.scale},
            markerStyle: {
              initial: {
                fill: opts.markerColor,
                stroke: opts.markerColor
              }
            },
            onRegionLabelShow: function(e, el, code) {
              if ( series && series[code] )
                el.html(el.html() + ': ' + series[code] + ' visitors');
            },
            markers: markers,
            series: {
                regions: [{
                    values: series,
                    scale: opts.scaleColors,
                    normalizeFunction: 'polynomial'
                }]
            },
          });
        }
    }
})();

/**=========================================================
 * Module: vmaps,js
 * jVector Maps support
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.maps')
        .controller('VectorMapController', VectorMapController);

    function VectorMapController() {
        var vm = this;

        activate();

        ////////////////

        function activate() {
          vm.seriesData = {
            'CA': 11100,   // Canada
            'DE': 2510,    // Germany
            'FR': 3710,    // France
            'AU': 5710,    // Australia
            'GB': 8310,    // Great Britain
            'RU': 9310,    // Russia
            'BR': 6610,    // Brazil
            'IN': 7810,    // India
            'CN': 4310,    // China
            'US': 839,     // USA
            'SA': 410      // Saudi Arabia
          };
          
          vm.markersData = [
            { latLng:[41.90, 12.45],  name:'Vatican City'          },
            { latLng:[43.73, 7.41],   name:'Monaco'                },
            { latLng:[-0.52, 166.93], name:'Nauru'                 },
            { latLng:[-8.51, 179.21], name:'Tuvalu'                },
            { latLng:[7.11,171.06],   name:'Marshall Islands'      },
            { latLng:[17.3,-62.73],   name:'Saint Kitts and Nevis' },
            { latLng:[3.2,73.22],     name:'Maldives'              },
            { latLng:[35.88,14.5],    name:'Malta'                 },
            { latLng:[41.0,-71.06],   name:'New England'           },
            { latLng:[12.05,-61.75],  name:'Grenada'               },
            { latLng:[13.16,-59.55],  name:'Barbados'              },
            { latLng:[17.11,-61.85],  name:'Antigua and Barbuda'   },
            { latLng:[-4.61,55.45],   name:'Seychelles'            },
            { latLng:[7.35,134.46],   name:'Palau'                 },
            { latLng:[42.5,1.51],     name:'Andorra'               }
          ];
        }
    }
})();

(function() {
  'use strict';

  /**
  * Constructor function for modal confirmations controllers.
  *
  * @class ModalCtrlConstructor
  * @param $scope {Object} AngularJS $scope object
  * @param $uibModalInstance {Object} AngularJS UI instance of the modal
  *     window the coontroller controls.
  * @param title {String} title of the modal window
  * @param text {String} text in the modal window's body
  */
  // XXX: this is defined as a variable, because there were *big* problems with
  // injecting controller as a dependency (and we need it to pass it as a
  // parameter to $modal.open())
  var ModalCtrlConstructor = function ($scope, $uibModalInstance, title, text) {

      $scope.title = title;
      $scope.text = text;

      /**
      * Closes the modal with a resolution of OK.
      * @method ok
      */
      $scope.ok = function () {
          $uibModalInstance.close(true);
      };

      /**
      * Closes the modal with a resolution of CANCEL.
      * @method ok
      */
      $scope.cancel = function () {
          $uibModalInstance.dismiss(false);
      };
  };

  // needed so that it works even when the code gets minified
  ModalCtrlConstructor.$inject = ['$scope', '$uibModalInstance', 'title', 'text'];


  /**
  * AngularJS Service for creating modal dialog instances.
  *
  * @class modalFactory
  */
  angular.module('app.modalFactory').factory('modalFactory', [
      '$uibModal',
      function ($uibModal) {

          return {
              /**
              * @class modalFactory
              */

              /**
              * Creates a new confirmation dialog instance.
              *
              * @class createConfirmInstance
              * @param title {String} title of the modal window
              * @param text {String} text in the modal window's body
              * @param isHeavy {Boolean} whether to create a "heavy" version
              *   of the confirmation dialog
              * @return {Object} AngularJS UI modal dialog instance
              */
              _createConfirmInstance: function (title, text, isHeavy) {
                  // this method, although "private", is publicly exposed in the
                  // factory object for easier testability
                  var templateUrl = isHeavy ?
                      'app/views/modals/confirm-heavy.html' :
                      'app/views/modals/confirm-light.html';

                  return $uibModal.open({
                      templateUrl: templateUrl,
                      controller: ModalCtrlConstructor,
                      backdrop: 'static',
                      keyboard: false,
                      resolve: {
                          title: function () {
                              return title;
                          },
                          text: function () {
                              return text;
                          }
                      }
                  });
              },

              /**
              * Opens a "light" confirmation dialog (generally used for
              * confirming non-critical actions).
              * @method confirmLight
              * @param title {String} title of the modal window
              * @param text {String} text in the modal window's body
              * @return {Object} modal dialog instance
              */
              confirmLight: function (title, text) {
                  return this._createConfirmInstance(title, text, false);
              },

              /**
              * Opens a "heavy" confirmation dialog (generally used for
              * confirming critical actions with major and/or irreversible
              * effects).
              * @method confirmHeavy
              * @param title {String} title of the modal window
              * @param text {String} text in the modal window's body
              * @return {Object} modal dialog instance
              */
              confirmHeavy:  function (title, text) {
                  return this._createConfirmInstance(title, text, true);
              },
          };

      }
  ]);
})();

(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Activity', [
            '$q',
            '$http',
            'Restangular',
            function ($q, $http, Restangular) {
              var Activity = Restangular.all('activities');

              // extend collection 
              Restangular.extendCollection('activities', function(collection) {
                return collection;
              });

              // extend model
              Restangular.extendModel('activities', function(model) {
                return model;
              });

              return Activity;
            }
        
        ]);
})();

(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Audio', [
            '$q',
            '$http',
            'Restangular',
            function ($q, $http, Restangular) {
              var Audio = Restangular.all('audio');

              // extend collection 
              Restangular.extendCollection('audio', function(collection) {
                return collection;
              });

              // extend model
              Restangular.extendModel('audio', function(model) {
                return model;
              });

              return Audio;
            }
        
        ]);
})();

(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Comment', [
            '$q',
            '$http',
            'Restangular',
            function ($q, $http, Restangular) {
              var Comment = Restangular.all('comments');

              // extend collection 
              Restangular.extendCollection('comments', function(collection) {
                return collection;
              });

              // extend model
              Restangular.extendModel('comments', function(model) {
                return model;
              });

              return Comment;
            }
        ]);
})();

(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('PracticeSession', [
            '$http',
            '$q',
            '$window',
            'Restangular',
            'APP_CONFIG',
            'Question',
            'Recording',
            function ($http, $q, $window, Restangular, APP_CONFIG, Question, Recording) {
              var PracticeSession = Restangular.all('practice_sessions');

              // extend collection 
              Restangular.extendCollection('practice_sessions', function(collection) {
                return collection;
              });

              // extend model
              Restangular.extendModel('practice_sessions', function(model) {

                model.initQuestions = function () {
                  var deferedGet = $q.defer();
                  var currentIndex = 0;
                  var playQuestions = [];
                  var currentQuestion = null;

                  model.questions.forEach(function (question) {
                    // only add questions without answers
                    if (model.answers.indexOf(question._id) < 0) {
                      if (!model.currentQuestion) {
                        model.currentQuestion = question;
                        model.currentIndex = currentIndex;
                      };
                      playQuestions.push(question);
                      currentIndex++;
                    }
                  });
                  model.playQuestions = playQuestions;
                  currentQuestion = playQuestions[0];
                  Question.get(currentQuestion._id).then(function (question) {
                    question.loadRecordingIndex().then(function () {
                      model.currentQuestion = question;
                      deferedGet.resolve();
                    });
                  });

                  return deferedGet.promise;
                };

                model.loadNextQuestion = function () {
                  var deferedGet = $q.defer();
                  var currentQuestion = null;

                  model.currentIndex = model.currentIndex + 1;
                  if (model.currentIndex > (model.playQuestions.length - 1)) {
                    model.currentIndex = model.playQuestions.length - 1;
                  }
                  if (model.currentIndex === (model.playQuestions.length - 1)) {
                    model.lastQuestion = true;
                  }

                  model.currentQuestion = model.playQuestions[model.currentIndex];

                  Question.get(model.currentQuestion._id).then(function (question) {
                    question.loadRecordingIndex().then(function () {
                      model.currentQuestion = question;
                      deferedGet.resolve(model.currentQuestion);
                    });
                  });
                
                  return deferedGet.promise;
                };

                return model;
              });
          
              // checks for an existing non-completed practiceSession for the given
              // practice set
              PracticeSession.initFromPracticeSet = function (practiceSet) {
                var deferedGet = $q.defer();
                var practiceSession = null;
                var submittedBy = $window.sessionStorage.getItem('user_id');
                var filter = {
                  practice_set: practiceSet._id,
                  platform: 'web',
                  status: 'started',
                  submitted_by: submittedBy
                };
                var params = {
                  sort: "-_created",
                  where: filter,
                  embedded: {"questions": 1}
                }

                PracticeSession.getList(params).then(function (practiceSessions) {;
                  if (practiceSessions.length > 0) {
                    deferedGet.resolve(practiceSessions[0]);
                  } else {
                    // create a new PracticeSession
                    var data = {
                      practice_set: practiceSet._id,
                      questions: practiceSet.questions
                    };
                    PracticeSession.create(data).then(function (newPracticeSession) {
                      deferedGet.resolve(newPracticeSession);
                    }, function (response) {
                      console.log('error creating practice session', response);
                      deferedGet.reject();
                    });
                  };
                });
                
                return deferedGet.promise;
              };

              PracticeSession.create = function (practiceSession) {
                var deferedPost = $q.defer();
                var questions = (practiceSession.questions) ? practiceSession.questions : [];
                var submittedBy = $window.sessionStorage.getItem('user_id');
                var request = {
                  method: 'POST',
                  url: APP_CONFIG.API.full + '/practice_sessions',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  data: {
                    practice_set: practiceSession.practice_set,
                    status: 'started',
                    platform: 'web',
                    audio: [],
                    answers: [],
                    questions: questions,
                    submitted_by: submittedBy 
                  }
                };

                $http(request)
                .then(function (response) {
                  var resourceId = response.data._id;
                  var embed = {
                    "questions": 1,
                    "submitted_by": 1,
                  };
                  var request = {
                    method: 'GET',
                    url: APP_CONFIG.API.full + '/practice_sessions/'+resourceId + '?embedded=' + JSON.stringify(embed),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  };
                  return $http(request);  // retrieve new practiceSession 
                }, $q.reject)
                .then(function (response) {
                  PracticeSession.get(response.data._id, {"embedded": {"questions": 1 }}).then(function (practiceSession) {
                    deferedPost.resolve(practiceSession);
                  });
                }, function () {
                  deferedPost.reject();
                });

                return deferedPost.promise;
              };

              return PracticeSession;
            }

        ]);
})();
    

(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('PracticeSet', [
            '$q',
            'Restangular',
            function ($q, Restangular) {
              var PracticeSet = Restangular.all('practice_sets');

              // extend collection 
              Restangular.extendCollection('practice_sets', function(collection) {

                collection.add = function(practiceSetData){
                  if (typeof practiceSetData.save === 'function') {
                     var practiceSet = practiceSetData;
                   } else {
                     var practiceSet = Restangular.restangularizeElement(this.parentResource, buildData, 'practice_sets');
                   }
                   this.push(practiceSet);
                };
                return collection;
              });

              // extend model
              Restangular.extendModel('practice_sets', function(model) {
                
                model.hydrateQuestions = function () {
                  var deferedGet = $q.defer();
                  var loadedQuestions = [];
                  var questionIds = [];

                  if (model.questions) {
                    model.questions.forEach(function (question) {
                      // this question has already been loaded
                      if (question.restangularized) {
                          loadedQuestions.push(question);
                          questionIds.push(question._id);
                          if (loadedQuestions.length === model.questions.length) {
                            model.questions = loadedQuestions;
                            model.questionIds = questionIds;
                            deferedGet.resolve(loadedQuestions);
                          }
                      } else {
                        // load it from the server and restangularize it
                        Restangular.one('questions', question).get().then(function (loadedQuestion) {
                          loadedQuestions.push(loadedQuestion);
                          questionIds.push(loadedQuestion._id);
                          if (loadedQuestions.length === model.questions.length) {
                            model.questions = loadedQuestions;
                            model.questionIds = questionIds;
                            deferedGet.resolve(loadedQuestions);
                          }
                        });
                      }
                    });
                  } else {
                    model.questions = [];
                    model.questionIds = [];
                    deferedGet.resolve([]);
                  }          

                  return deferedGet.promise;
                };

                model.clearQuestions = function () {
                  model.questions = [];
                  model.update(model);
                };

                return model;
              });

              return PracticeSet;
            }

        ]);
})();

(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Question', [
            '$q',
            '$window',
            'Restangular',
            'Recording',
            'PracticeSet',
            'APP_CONFIG',
            function ($q, $window, Restangular, Recording, PracticeSet, APP_CONFIG) {
              var Question = Restangular.all('questions');
             
              // extend collection 
              Restangular.extendCollection('questions', function(collection) {

                collection.add = function(questionData){
                  if (typeof questionData.save === 'function') {
                     var question = questionData;
                   } else {
                     var question = Restangular.restangularizeElement(this.parentResource, buildData, 'questions');
                   }
                   this.push(question);
                };

                return collection;
              });

              // extend model
              Restangular.extendModel('questions', function(model) {

                /**
                 * loads audio meta data for question model
                 *   hasQuestionRecording 
                 *    - total number of question audio files, grouped by language
                 *   hasAnswerRecording 
                 *    - total number of answer audio files, grouped by language
                 *   currentRecordingIndex 
                 *    - current index of audio file grouped by language
                 */
                model.loadRecordingIndex = function () {
                  var deferedGet = $q.defer();
                  var projection = {
                    _id: 1,
                    status: 1,
                    submitted_by: 1,
                    context: 1,
                    language_code: 1,
                    _created: 1
                  };
                  var filter = {
                    "question": model._id,
                  };
                  var params = {
                    "where": filter,
                    "projection": projection
                  };
                  var submittedBy = $window.sessionStorage.getItem('user_id');

                  Recording.getList(params).then(function (audioIndex) {
                    model.totalQuestionRecording = {};
                    model.totalAnswerRecording = {};
                    model.hasQuestionRecording = {};
                    model.hasAnswerRecording = {};

                    APP_CONFIG.languages.forEach(function (language) {
                      model.totalQuestionRecording[language.code] = 0;
                      model.totalAnswerRecording[language.code] = 0;
                    });

                    audioIndex.forEach(function (audio) {
                      if (audio.context === 'question') {
                        model.totalQuestionRecording[audio.language_code]++;
                        if (audio.submitted_by === submittedBy) {
                          model.hasUserRecording = true;
                        }
                      }
                      if (audio.context === 'answer') {
                        model.totalAnswerRecording[audio.language_code]++;
                      }
                    });
                    model.audioIndex = audioIndex;

                    APP_CONFIG.languages.forEach(function (language) {
                      model.hasQuestionRecording[language.code] = (model.totalQuestionRecording[language.code] > 0);
                      model.hasAnswerRecording[language.code] = (model.totalAnswerRecording[language.code] > 0);
                    });

                    model.currentRecordingIndex = {};
                    APP_CONFIG.languages.forEach(function (language) {
                      model.currentRecordingIndex[language.code] = 0;
                    });
                    
                    model.currentRecording = null;

                    deferedGet.resolve(audioIndex);
                  });

                  return deferedGet.promise;
                };

                model.flipCard = function() {
                  model.flipped = !model.flipped;
                  model.cardClass = (model.flipped) ? 'flipped' : null;
                };

                /**
                 * Return promise of audio blob url
                 *
                 * index - can be int, 'next, 'previous', or 'random'
                 *         correlates to audio in currentRecordingIndex
                 */
                model.getRecordingUrl = function(language, index) {
                  var params;
                  var num = model.currentRecordingIndex[language];
                  var max = (model.totalQuestionRecording[language] - 1);
                  var deferedGet = $q.defer();
                  var url = null;
                  var filter = {
                    "question": model._id,
                    "language_code": language,
                    "context": "question"
                  }
                  var embed = {
                    "submitted_by": 1
                  }

                  if (index) {
                    if (!isNaN(index)) {
                      num = index;
                    } else {
                      if (index === 'next') {
                        num = (model.currentRecordingIndex[language] + 1);
                        if (num > max) {
                          deferedGet.reject();
                          return deferedGet.promise;
                        }
                      } else if (index === 'previous') {
                        num = (model.currentRecordingIndex[language] - 1);
                        if (num < 0) {
                          deferedGet.reject();
                          return deferedGet.promise;
                        }
                      } else if (index === 'random') {
                        num = Math.floor(Math.random() * (max - 1 + 1)) + 1;
                        num = num - 1;
                        if ((num < 0) || (num > max)) {
                          deferedGet.reject();
                          return deferedGet.promise;
                        }
                      } else {
                        deferedGet.reject();
                        return deferedGet.promise;
                      }
                      model.currentRecordingIndex[language] = num;
                    }
                  }

                  params = {
                    "where": filter,
                    "embedded": embed,
                    "max_results": 1,
                    "page": (num + 1)
                  }

                  Recording.getList(params).then(function (audio) {
                    // load audio into audio player
                    var firstRecording = audio[0];
                    var blob = firstRecording.createBlob();
                    var url = URL.createObjectURL(blob);
                    model.currentRecording = firstRecording;
                    deferedGet.resolve(url); 
                  });

                  return deferedGet.promise;
                };

                model.addToPracticeSet = function(practiceSet) {
                  practiceSet.questions.push(model._id);
                  PracticeSet.one(practiceSet._id).patch(practiceSet);
                };

                model.removeFromPracticeSet = function(practiceSet) {
                  practiceSet.questions = _.without(practiceSet.questions, model._id);
                  PracticeSet.one(practiceSet._id).patch(practiceSet);
                };

                return model;

              }); 
              return Question;
            }
        
        ]);
})();

(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Rating', [
            '$q',
            '$http',
            'Restangular',
            function ($q, $http, Restangular) {
              var Rating = Restangular.all('ratings');

              // extend collection 
              Restangular.extendCollection('ratings', function(collection) {
                return collection;
              });

              // extend model
              Restangular.extendModel('ratings', function(model) {
                return model;
              });

              return Rating;
            }
        
        ]);
})();

(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Recording', [
            '$q',
            '$http',
            '$window',
            'Restangular',
            'APP_CONFIG',
            function ($q, $http, $window, Restangular, APP_CONFIG) {
              var Recording = Restangular.all('audio');

              //audio.file = (data.file) ? data.file : Recording.audioFileBlob(data.audio);
              // extend collection 
              Restangular.extendCollection('audio', function(collection) {
                return collection;
              });

              // extend model
              Restangular.extendModel('audio', function(model) {

                /**
                * Takes base64 string and converts it to 
                * and audio/mp3 blob
                */
                model.createBlob  = function () {
                  if (!model.audio) {
                    return false;
                  }
                  var contentType = 'audio/mp3';
                  var sliceSize = 512;
                  var data = model.audio.replace(/\s/g, '');
                  var byteCharacters = atob(data);
                  var byteArrays = [];

                  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                  }

                  var blob = new Blob(byteArrays, {type: contentType});
                  model.blob = blob;
                  
                  return blob;
                };

                return model;
              });

              /**
               * Not sure if we can do this with Restangular
               * so leaving this here for now
               */
              Recording.create = function(blob, context, language, question) {
                var deferedPost = $q.defer();
                var questionId = question._id
                var questionText = question.text.translations[language];
                var submittedBy = $window.sessionStorage.getItem('user_id');
                var request = {
                  method: 'POST',
                  url: APP_CONFIG.API.full + '/audio',
                  headers: {'Content-Type': undefined},
                  transformRequest: function(data) { 
                    var payload = new FormData();
                    payload.append('audio', data.blob, 'audio.mp3');
                    payload.append('context', data.context);
                    payload.append('language_code', data.language_code);
                    payload.append('question_text', questionText);
                    payload.append('status', data.status);
                    payload.append('question', data.question);
                    payload.append('submitted_by', data.submitted_by);
                    return payload; 
                  },
                  data: {
                    blob: blob,
                    context: context,
                    language_code: language,
                    status: 'submitted',
                    question: questionId,
                    submitted_by: submittedBy 
                  }
                }

                $http(request)
                .then(function (response) {
                  var resourceId = response.data._id;
                  var embedString = '?embedded={"question": 1, "submitted_by": 1}';
                  var request = {
                    method: 'GET',
                    url: APP_CONFIG.API.full + '/audio/'+resourceId + embedString,
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  };
                  return $http(request);  // retrieve created audio
                }, $q.reject)
                .then(function (response) {
                  var audio = response.data;
                  deferedPost.resolve(audio);
                }, function (response) {
                  deferedPost.reject(response);
                });

                return deferedPost.promise;
              };
          
              return Recording;
            }

        ]);
})();

(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('Tag', [
            '$q',
            '$http',
            'Restangular',
            'APP_CONFIG',
            function ($q, $http, Restangular, APP_CONFIG) {
              var Tag = Restangular.all('tags');
             
              // extend collection 
              Restangular.extendCollection('tags', function(collection) {

                collection.add = function(tagData){
                  if (typeof tagData.save === 'function') {
                     var tag = tagData;
                   } else {
                     var tag = Restangular.restangularizeElement(this.parentResource, buildData, 'tags');
                   }
                   this.push(tag);
                };

                return collection;
              });

              // extend model
              Restangular.extendModel('tags', function(model) {

                // TODO: add getQuestions() function?
               

                model.updateImage = function (file) {
                  var deferedPost = $q.defer();
                  var request = {
                    method: 'PATCH',
                    url: APP_CONFIG.API.full + '/tags/' + model._id,
                    headers: {
                      'If-Match': model._etag,
                      'Content-Type': undefined
                    },
                    transformRequest: function(data) { 
                      var payload = new FormData();
                      payload.append('image', file);
                      return payload; 
                    },
                    data: {
                      image: file
                    }
                  };

                  $http(request)
                  .then(function (response) {
                    var resourceId = response.data._id;
                    var request = {
                      method: 'GET',
                      url: APP_CONFIG.API.full + '/tags/'+resourceId,
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    };
                    return $http(request);  // retrieve update tags
                  }, $q.reject)
                  .then(function (response) {
                    Tag.get(response.data._id).then(function (tag) {
                      deferedPost.resolve(tag);
                    });
                  }, function (response) {
                    deferedPost.reject(response);
                  });

                  return deferedPost.promise;
                };

                return model;

              }); 
              return Tag;
            }
    
        ]);
})();

(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('User', [
            '$http',
            '$q',
            'Restangular',
            'Recording',
            'PracticeSession',
            'PracticeSet',
            'Comment',
            'APP_CONFIG',
            function (
              $http,
              $q,
              Restangular,
              Recording,
              PracticeSession,
              PracticeSet,
              Comment,
              APP_CONFIG) {
              var User = Restangular.all('users');
            
              // extend model
              Restangular.extendModel('users', function(model) {

                model.getRecording = function (maxResults, page) {
                  var deferedGet = $q.defer();
                  var filter = {
                    "submitted_by": model._id
                  }
                  var params = {
                    "where": filter
                  }
                  if (maxResults) {
                    params.max_results = maxResults;
                  }
                  if (page) {
                    params.page = page;
                  }
                  Recording.getList(params).then(function (audio) {
                    model.audio = audio;
                    deferedGet.resolve(audio); 
                  });
                  return deferedGet.promise;
                };

                model.getPracticeSessions = function (maxResults, page) {
                  var deferedGet = $q.defer();
                  var filter = {
                    "submitted_by": model._id
                  }
                  var params = {
                    "where": filter
                  }
                  if (maxResults) {
                    params.max_results = maxResults;
                  }
                  if (page) {
                    params.page = page;
                  }
                  PracticeSession.getList(params).then(function (practiceSessions) {
                    model.practiceSessions = practiceSessions;
                    deferedGet.resolve(practiceSessions); 
                  });
                  return deferedGet.promise;
                };

                model.getComments = function (maxResults, page) {
                  var deferedGet = $q.defer();
                  var filter = {
                    "affected_user": model._id
                  }
                  var params = {
                    "where": filter
                  }
                  if (maxResults) {
                    params.max_results = maxResults;
                  }
                  if (page) {
                    params.page = page;
                  }
                  Comment.getList(params).then(function (comments) {
                    model.comments = comments;
                    deferedGet.resolve(comments); 
                  });
                  return deferedGet.promise;
                };

                model.getPracticeSets = function (maxResults, page) {
                  var deferedGet = $q.defer();
                  var filter = {
                    "submitted_by": model._id
                  }
                  var params = {
                    "where": filter
                  }
                  if (maxResults) {
                    params.max_results = maxResults;
                  }
                  if (page) {
                    params.page = page;
                  }
                  PracticeSet.getList(params).then(function (practiceSets) {
                    model.practiceSets = practiceSets;
                    deferedGet.resolve(practiceSets); 
                  });
                  return deferedGet.promise;
                };

                model.getResponses = function (maxResults, page) {
                  var deferedGet = $q.defer();
                  var filter = {};
                  var params = {};
                    
                  if (maxResults) {
                    params.max_results = maxResults;
                  }
                  if (page) {
                    params.page = page;
                  }
                  // get all practice sessions with question qudio from this user 
                  filter = { 
                    "context": "answer",
                    "affected_user": model._id
                  }
                  params.where = filter;
                  params.embedded = { "parent_audio": 1 }
                  params.sort = "-_created";
                  Recording.getList(params).then(function (allAnswers) {
                    model.responses = allAnswers;
                    deferedGet.resolve(allAnswers);
                  });
          
                  return deferedGet.promise;
                };

                model.updateImage = function (file) {
                  var deferedPost = $q.defer();
                  var request = {
                    method: 'PATCH',
                    url: APP_CONFIG.API.full + '/users/' + model._id,
                    headers: {
                      'If-Match': model._etag,
                      'Content-Type': undefined
                    },
                    transformRequest: function(data) { 
                      var payload = new FormData();
                      payload.append('image', file);
                      return payload; 
                    },
                    data: {
                      image: file
                    }
                  };

                  $http(request)
                  .then(function (response) {
                    var resourceId = response.data._id;
                    var request = {
                      method: 'GET',
                      url: APP_CONFIG.API.full + '/users/'+resourceId,
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    };
                    return $http(request);  // retrieve update user 
                  }, $q.reject)
                  .then(function (response) {
                    User.get(response.data._id).then(function (user) {
                      deferedPost.resolve(user);
                    });
                  }, function (response) {
                    deferedPost.reject(response);
                  });

                  return deferedPost.promise;
                };

                model.checkProfile = function () {
                  var profileSteps = 1;
                  model.missing = [];

                  if (model.image) {
                    profileSteps += 1;
                  } else {
                    model.missing.push(' a Profile Image');
                  }

                  if (model.city && model.country) {
                    profileSteps += 1;
                  } else {
                    model.missing.push('your Location');
                  }

                  if (model.mobile) {
                    profileSteps += 1;
                  } else {
                    model.missing.push('your Mobile');
                  }

                  if (profileSteps === 4) {
                    model.profileStatus = "success";
                  } else {
                    model.profileStatus = "warning";
                  }

                  model.percentComplete = ((profileSteps / 4) * 100);
                };

                return model;
              });

              User.initUser = function (userId) {
                var deferedGet = $q.defer();

                User.initUserStats(userId).then(function (user) {
                    user.checkProfile();
                    deferedGet.resolve(user);
                }, function (response) {
                    deferedGet.reject(response);
                });

                return deferedGet.promise;
              };

              // can take a user object or user._id
              User.initUserStats = function (user) {
                var deferedGet = $q.defer();
                var profileUser = null;
                
                if (typeof user === 'object') {
                  profileUser = user._id;
                } else {
                  profileUser = user;
                }


                User.get(profileUser).then(function (user) {
                  // get extra restangular model functions
                  profileUser = user;
                }, $q.reject).then(function () {
                  // get audio
                  var params = { "where": { "submitted_by": profileUser._id }, "max_results": 5 }
                  Restangular.all('audio').getList(params).then(function (audios) {
                    profileUser.allRecordings = audios;
                    profileUser.totalRecordings = audios._meta.total;
                  });
                }, $q.reject).then(function () {
                  // get questions
                  var params = { "where": { "submitted_by": profileUser._id, "context": "question" }, "max_results": 5 }   
                  Restangular.all('audio').getList(params).then(function (audios) {
                    profileUser.allQuestions = audios;
                    profileUser.totalQuestions = audios._meta.total;
                  });
                }, $q.reject).then(function () {
                  // get answers
                  var params = { "where": { "submitted_by": profileUser._id, "context": "answer" }, "max_results": 5 }   
                  Restangular.all('audio').getList(params).then(function (audios) {
                    profileUser.allAnswers = audios;
                    profileUser.totalAnswers = audios._meta.total;
                  });
                }, $q.reject).then(function () {
                  // get practice sessions
                  var params = { "where": { "submitted_by": profileUser._id }, "max_results": 5 }   
                  Restangular.all('practice_sessions').getList(params).then(function (practiceSessions) {
                    profileUser.allPracticeSessions = practiceSessions;
                    profileUser.totalPracticeSessions = practiceSessions._meta.total;
                  });
                }, $q.reject).then(function () {
                  // get comments
                  var params = { "where": { "affected_user": profileUser._id }, "max_results": 5 }   
                  Restangular.all('comments').getList(params).then(function (comments) {
                    profileUser.allComments = comments;
                    profileUser.totalComments = comments._meta.total;
                  });
                }, $q.reject).then(function () {
                  // get practice sets
                  var params = { "where": { "submitted_by": profileUser._id }, "max_results": 5 }   
                  Restangular.all('practice_sets').getList(params).then(function (practiceSets) {
                    profileUser.allPracticeSets = practiceSets;
                    profileUser.totalPracticeSets = practiceSets._meta.total;
                  });
                }, $q.reject).then(function () {
                  // get responsess
                  var params = { "where": { "affected_user": profileUser._id, "context": "answer" }, "max_results": 5 }
                  Restangular.all('audio').getList(params).then(function (responses) {
                    profileUser.allResponses = responses;
                    profileUser.totalResponses = responses._meta.total;
                  });
                }, $q.reject).then(function () {
                  // get ratings
                  var params = { "where": { "affected_user": profileUser._id }, "max_results": 5 }
                  Restangular.all('ratings').getList(params).then(function (ratings) {
                    profileUser.allRatings = ratings;
                    profileUser.totalRatings = ratings._meta.total;
                  });
                }, $q.reject).then(function () {
                  // calculate understandable rating
                  var params = { "where": { "affected_user": profileUser._id, "rating": {"$gte": 3 }}, "max_results": 1 }   
                  Restangular.all('ratings').getList(params).then(function (ratings) {
                    var percent = Math.round((ratings._meta.total / profileUser.totalRatings) * 100);
                    profileUser.understandable = (isNaN(percent)) ? 0 : percent; 
                  });
                }, $q.reject).then(function () {
                  // mark as initialized
                  // so we don't have to repeat
                  profileUser.initialized = true;
                  deferedGet.resolve(profileUser);
                });
                return deferedGet.promise;
              };

              User.initTimeline = function (user) {
                //var deferedGet = $q.defer();
                var timeline = [];

                // add audio events
                angular.forEach(user.allRecordings, function (audio) {
                    var date = new Date(audio._created);
                    var day = moment(date).format('YYYY-MM-DD');
                    if (!_.findWhere(timeline, {'date': moment(date).format('ll'), 'action': 'separator'})) {
                      timeline.push({
                        date: moment(date).format('ll'),
                        action: 'separator',
                        icon: 'timeline-separator',
                        order: moment(day).format('X') + 1
                      });
                    }
                    timeline.push({
                      date: moment(date).format('ll'),
                      submittedBy: audio.submitted_by,
                      profile: APP_CONFIG.API.rootURI + '/assets/profile_images/' + audio.submitted_by, 
                      icon: 'fa fa-volume-off',
                      color: 'warning',
                      action: 'added ' + audio.context + ' audio',
                      link: audio.question_text,
                      order: moment(day).format('X')
                    });
                });

                // add comment events
                angular.forEach(user.allComments, function (comment) {
                    var date = new Date(comment._created);
                    var day = moment(date).format('YYYY-MM-DD');
                    if (!_.findWhere(timeline, {'date': moment(date).format('ll'), 'action': 'separator'})) {
                      timeline.push({
                        date: moment(date).format('ll'),
                        action: 'separator',
                        icon: 'timeline-separator',
                        order: moment(day).format('X') + 1
                      });
                    }
                    timeline.push({
                      date: moment(date).format('ll'),
                      submittedBy: comment.submitted_by,
                      profile: APP_CONFIG.API.rootURI + '/assets/profile_images/' + comment.submitted_by, 
                      color: 'green',
                      icon: 'fa fa-comment',
                      action: 'commented on ' + comment.context + ' audio',
                      link: comment.text,
                      order: moment(day).format('X')
                    });
                });

                // add rate events
                angular.forEach(user.allRatings, function (rate) {
                    var date = new Date(rate._created);
                    var day = moment(date).format('YYYY-MM-DD');
                    if (!_.findWhere(timeline, {'date': moment(date).format('ll'), 'action': 'separator'})) {
                      timeline.push({
                        date: moment(date).format('ll'),
                        action: 'separator',
                        icon: 'timeline-separator',
                        order: moment(day).format('X') + 1
                      });
                    }
                    timeline.push({
                      date: moment(date).format('ll'),
                      submittedBy: rate.submitted_by,
                      profile: APP_CONFIG.API.rootURI + '/assets/profile_images/' + rate.submitted_by, 
                      color: 'info',
                      icon: 'fa fa-star',
                      action: 'rated ' + rate.context + ' audio',
                      link: rate.rating,
                      order: moment(day).format('X')
                    });
                });

                timeline = _.sortBy(timeline, function(e) { return e.order; })
                timeline = timeline.reverse();

                return timeline;
              };

              return User;
            }
        
        ]);
})();


(function() {
    'use strict';

    /* audio recorder service. */
    angular.module('app.mymemory').service('mymemory', [ 
      '$q',
      '$http',
      '$localStorage',
      'APP_CONFIG',
      'session',
      function mymemory($q, $http, $localStorage, APP_CONFIG, session) {
        var self = this;

        self.translateText = function(text, from, to) {
          var deferedTranslate = $q.defer();
          var url = APP_CONFIG.mymemory.rootURI + 'get?q=' + text + '&langpair=';
          var cacheKey = 'mm-' + text + '-' + from + '-' + to;
          url += from + '|' + to;

          if ($localStorage[cacheKey]) {
            deferedTranslate.resolve($localStorage[cacheKey]);
          } else {
            // make call to translation service api
            $http({
              method: 'GET',
              url: url,
              headers: { 'Accept': 'application/json, text/plain, */*' }
            }).then(function (response) {
              if (!response.data.matches) {
                console.log('bad response from mymemory', response);
                deferedTranslate.reject();
              } else {
                // save to browser cache
                $localStorage[cacheKey] = response.data.matches;
                deferedTranslate.resolve(response.data.matches);
              }
            }, function (response) {
              deferedTranslate.reject();
            });
          }

          return deferedTranslate.promise;
        }; 
      }
    ]);
})();

/**=========================================================
 * Module: navbar-search.js
 * Navbar search toggler * Auto dismiss on ESC key
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.navsearch')
        .directive('searchOpen', searchOpen)
        .directive('searchDismiss', searchDismiss);

    //
    // directives definition
    // 
    
    function searchOpen () {
        var directive = {
            controller: searchOpenController,
            restrict: 'A'
        };
        return directive;

    }

    function searchDismiss () {
        var directive = {
            controller: searchDismissController,
            restrict: 'A'
        };
        return directive;
        
    }

    //
    // Contrller definition
    // 
    
    searchOpenController.$inject = ['$scope', '$element', 'NavSearch'];
    function searchOpenController ($scope, $element, NavSearch) {
      $element
        .on('click', function (e) { e.stopPropagation(); })
        .on('click', NavSearch.toggle);
    }

    searchDismissController.$inject = ['$scope', '$element', 'NavSearch'];
    function searchDismissController ($scope, $element, NavSearch) {
      
      var inputSelector = '.navbar-form input[type="text"]';

      $(inputSelector)
        .on('click', function (e) { e.stopPropagation(); })
        .on('keyup', function(e) {
          if (e.keyCode === 27) // ESC
            NavSearch.dismiss();
        });
        
      // click anywhere closes the search
      $(document).on('click', NavSearch.dismiss);
      // dismissable options
      $element
        .on('click', function (e) { e.stopPropagation(); })
        .on('click', NavSearch.dismiss);
    }

})();


/**=========================================================
 * Module: nav-search.js
 * Services to share navbar search functions
 =========================================================*/
 
(function() {
    'use strict';

    angular
        .module('app.navsearch')
        .service('NavSearch', NavSearch);

    function NavSearch() {
        this.toggle = toggle;
        this.dismiss = dismiss;

        ////////////////

        var navbarFormSelector = 'form.navbar-form';

        function toggle() {
          var navbarForm = $(navbarFormSelector);

          navbarForm.toggleClass('open');
          
          var isOpen = navbarForm.hasClass('open');
          
          navbarForm.find('input')[isOpen ? 'focus' : 'blur']();
        }

        function dismiss() {
          $(navbarFormSelector)
            .removeClass('open') // Close control
            .find('input[type="text"]').blur() // remove focus
            .val('') // Empty input
            ;
        }        
    }
})();

/**=========================================================
 * Module: notify.js
 * Directive for notify plugin
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.notify')
        .directive('notify', notify);

    notify.$inject = ['$window', 'Notify'];
    function notify ($window, Notify) {

        var directive = {
            link: link,
            restrict: 'A',
            scope: {
              options: '=',
              message: '='
            }
        };
        return directive;

        function link(scope, element) {

          element.on('click', function (e) {
            e.preventDefault();
            Notify.alert(scope.message, scope.options);
          });
        }

    }

})();


/**=========================================================
 * Module: notify.js
 * Create a notifications that fade out automatically.
 * Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
 =========================================================*/

(function() {
    'use strict';
    angular
        .module('app.notify')
        .service('Notify', Notify);

    Notify.$inject = ['$timeout'];
    function Notify($timeout) {

        this.alert = notifyAlert;

        ////////////////

        function notifyAlert(msg, opts) {
            if ( msg ) {
                $timeout(function(){
                    $.notify(msg, opts || {});
                });
            }
        }
    }

})();

/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */
(function($){
    'use strict';
    var containers = {},
        messages   = {},
        notify     =  function(options){
            if ($.type(options) === 'string') {
                options = { message: options };
            }
            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) === 'string' ? {status:arguments[1]} : arguments[1]);
            }
            return (new Message(options)).show();
        },
        closeAll  = function(group, instantly){
            var id;
            if(group) {
                for(id in messages) { if(group===messages[id].group) messages[id].close(instantly); }
            } else {
                for(id in messages) { messages[id].close(instantly); }
            }
        };
    var Message = function(options){
        // var $this = this;
        this.options = $.extend({}, Message.defaults, options);
        this.uuid    = 'ID'+(new Date().getTime())+'RAND'+(Math.ceil(Math.random() * 100000));
        this.element = $([
            // @geedmo: alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
                '<a class="close">&times;</a>',
                '<div>'+this.options.message+'</div>',
            '</div>'
        ].join('')).data('notifyMessage', this);
        // status
        if (this.options.status) {
            this.element.addClass('alert alert-'+this.options.status);
            this.currentstatus = this.options.status;
        }
        this.group = this.options.group;
        messages[this.uuid] = this;
        if(!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-'+this.options.pos+'"></div>').appendTo('body').on('click', '.uk-notify-message', function(){
                $(this).data('notifyMessage').close();
            });
        }
    };
    $.extend(Message.prototype, {
        uuid: false,
        element: false,
        timout: false,
        currentstatus: '',
        group: false,
        show: function() {
            if (this.element.is(':visible')) return;
            var $this = this;
            containers[this.options.pos].show().prepend(this.element);
            var marginbottom = parseInt(this.element.css('margin-bottom'), 10);
            this.element.css({'opacity':0, 'margin-top': -1*this.element.outerHeight(), 'margin-bottom':0}).animate({'opacity':1, 'margin-top': 0, 'margin-bottom':marginbottom}, function(){
                if ($this.options.timeout) {
                    var closefn = function(){ $this.close(); };
                    $this.timeout = setTimeout(closefn, $this.options.timeout);
                    $this.element.hover(
                        function() { clearTimeout($this.timeout); },
                        function() { $this.timeout = setTimeout(closefn, $this.options.timeout);  }
                    );
                }
            });
            return this;
        },
        close: function(instantly) {
            var $this    = this,
                finalize = function(){
                    $this.element.remove();
                    if(!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }
                    delete messages[$this.uuid];
                };
            if(this.timeout) clearTimeout(this.timeout);
            if(instantly) {
                finalize();
            } else {
                this.element.animate({'opacity':0, 'margin-top': -1* this.element.outerHeight(), 'margin-bottom':0}, function(){
                    finalize();
                });
            }
        },
        content: function(html){
            var container = this.element.find('>div');
            if(!html) {
                return container.html();
            }
            container.html(html);
            return this;
        },
        status: function(status) {
            if(!status) {
                return this.currentstatus;
            }
            this.element.removeClass('alert alert-'+this.currentstatus).addClass('alert alert-'+status);
            this.currentstatus = status;
            return this;
        }
    });
    Message.defaults = {
        message: '',
        status: 'normal',
        timeout: 5000,
        group: null,
        pos: 'top-center'
    };
    
    $.notify          = notify;
    $.notify.message  = Message;
    $.notify.closeAll = closeAll;
    
    return notify;
}(jQuery));

/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller(
            'LoginFormController',
            ['$http', '$state', 'session', 'User',
                function LoginFormController($http, $state, session, User) {
                    var self = this;

                    activate();

                    ////////////////

                    function activate() {
                      // bind here all data from the form
                      self.account = {
                        email: (self.loginForm) ? self.loginForm.account_email.$modelValue : null,
                        password: (self.loginForm) ? self.loginForm.account_password.$modelValue : null
                      };
                      // place the message if something goes wrong
                      self.authMsg = '';

                      self.login = function() {
                        self.authMsg = '';
 
                        if(self.loginForm.$valid) {
                             
                          session.newTokenByLogin(self.account.email, self.account.password)
                            .then(function(response) {
                              // assumes if ok, response will have a token, if not, a string with error
                              if ( !response.token ) {
                                self.authMsg = 'Incorrect credentials.';
                              }else{
                                $state.go('app.dashboard');
                              }
                            }, function() {
                              self.authMsg = 'Server Request Error';
                            });
                        }
                        else {
                          // set as dirty if the user click directly to login so we show the validation messages
                          /*jshint -W106*/
                          self.loginForm.account_email.$dirty = true;
                          self.loginForm.account_password.$dirty = true;
                        }
                      };
                    }
                }
            ]
        );
})();

/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.pages').controller('RegisterFormController', [
    '$http',
    '$state',
    'APP_CONFIG',
    'Signup',
    function RegisterFormController($http, $state, APP_CONFIG, Signup) {
        var self = this;

        activate();

        ////////////////

        function activate() {
          // bind here all data from the form
          self.account = {};
          // place the message if something goes wrong
          self.authMsg = '';
            
          self.register = function() {
            self.authMsg = '';

            if(self.registerForm.$valid) {
              var newUser = {
                username: self.account.email,
                password: self.register.password,
                email: self.account.email,
                speaks: self.register.speaks,
                learning: self.register.learning 
              };
            
              Signup.createUser(newUser).then(function (userId) {
                // create the default practice set
                Signup.createDefaultPracticeSet(self.register.speaks).then(function () {
                  $state.go('app.dashboard');
                });
              }, function() {
                self.authMsg = 'Server Request Error';
              });
            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              self.registerForm.account_email.$dirty = true;
              self.registerForm.account_password.$dirty = true;
              self.registerForm.account_agreed.$dirty = true;
              
            }
          };
        }
    }]);
})();

(function() {
    'use strict';

    /**
    * A factory which creates a question model.
    *
    * @class Topic
    */
    angular.module('app.pages').factory('Signup', [
        '$q',
        '$http',
        'PracticeSet',
        'Question',
        'APP_CONFIG',
        'session',
        function ($q, $http, PracticeSet, Question, APP_CONFIG, session) {
          var Signup = function () {};

          Signup.createUser = function (signupForm) {
            var deferedPost = $q.defer();

            var newUser = {
              "username": signupForm.username,
              "password": signupForm.password,
              "email": signupForm.email,
              "speaks": [ signupForm.speaks ],
              "learning": [ signupForm.learning ],
              "roles": [ "user" ]
            };
            var request = {
              method: 'POST',
              url: APP_CONFIG.API.full + '/users',
              headers: {
                'Content-Type': 'application/json'
              },
              data: newUser,
            } 
            
            $http(request)
            .success(function(response) {
              var userId = response._id;
              // login
              session.newTokenByLogin(signupForm.username, signupForm.password).then(function () {
                deferedPost.resolve(userId);
              });
            })
            .error(function(response) {
              deferedPost.reject(response);
            });

            return deferedPost.promise;
          };
     
          Signup.createDefaultPracticeSet = function (speaks) {
            var deferedPost = $q.defer();
            var params = {
              "where": JSON.stringify({ "tags": "introduction" })
            }

            Question.getList(params).then(function (questions) {
              var questionIds = _.pluck(questions, '_id');

              // add the default introudction practice set with questio ids
              var description = {}
              description[speaks] = 'Tell us about yourself';
              var newPracticeSet = {
                title: 'Introduction', // TODO: translate this
                description: {
                  translations: description
                },
                category: 'tandem',
                questions: questionIds,
                submitted_by: session.userId
              }
              PracticeSet.post(newPracticeSet).then(function (practiceSet) {
                deferedPost.resolve(practiceSet);
              });
            });

            return deferedPost.promise;
          };
     
          return Signup;
        }
    ]);
})();

/**=========================================================
 * Collapse panels * [panel-collapse]
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('panelCollapse', panelCollapse);

    function panelCollapse () {
        var directive = {
            controller: Controller,
            restrict: 'A',
            scope: false
        };
        return directive;
    }

    Controller.$inject = ['$scope', '$element', '$timeout', '$localStorage'];
    function Controller ($scope, $element, $timeout, $localStorage) {
      var storageKeyName = 'panelState';

      // Prepare the panel to be collapsible
      var $elem   = $($element),
          parent  = $elem.closest('.panel'), // find the first parent panel
          panelId = parent.attr('id');

      // Load the saved state if exists
      var currentState = loadPanelState( panelId );
      if ( typeof currentState !== 'undefined') {
        $timeout(function(){
            $scope[panelId] = currentState; },
          10);
      }

      // bind events to switch icons
      $element.bind('click', function(e) {
        e.preventDefault();
        savePanelState( panelId, !$scope[panelId] );

      });
  
      // Controller helpers
      function savePanelState(id, state) {
        if(!id) return false;
        var data = angular.fromJson($localStorage[storageKeyName]);
        if(!data) { data = {}; }
        data[id] = state;
        $localStorage[storageKeyName] = angular.toJson(data);
      }
      function loadPanelState(id) {
        if(!id) return false;
        var data = angular.fromJson($localStorage[storageKeyName]);
        if(data) {
          return data[id];
        }
      }
    }

})();

/**=========================================================
 * Dismiss panels * [panel-dismiss]
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('panelDismiss', panelDismiss);

    function panelDismiss () {

        var directive = {
            controller: Controller,
            restrict: 'A'
        };
        return directive;

    }

    Controller.$inject = ['$scope', '$element', '$q', 'Utils'];
    function Controller ($scope, $element, $q, Utils) {
      var removeEvent   = 'panel-remove',
          removedEvent  = 'panel-removed';

      $element.on('click', function (e) {
        e.preventDefault();

        // find the first parent panel
        var parent = $(this).closest('.panel');

        removeElement();

        function removeElement() {
          var deferred = $q.defer();
          var promise = deferred.promise;
          
          // Communicate event destroying panel
          $scope.$emit(removeEvent, parent.attr('id'), deferred);
          promise.then(destroyMiddleware);
        }

        // Run the animation before destroy the panel
        function destroyMiddleware() {
          if(Utils.support.animation) {
            parent.animo({animation: 'bounceOut'}, destroyPanel);
          }
          else destroyPanel();
        }

        function destroyPanel() {

          var col = parent.parent();
          parent.remove();
          // remove the parent if it is a row and is empty and not a sortable (portlet)
          col
            .filter(function() {
            var el = $(this);
            return (el.is('[class*="col-"]:not(.sortable)') && el.children('*').length === 0);
          }).remove();

          // Communicate event destroyed panel
          $scope.$emit(removedEvent, parent.attr('id'));

        }

      });
    }
})();



/**=========================================================
 * Refresh panels
 * [panel-refresh] * [data-spinner="standard"]
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('panelRefresh', panelRefresh);

    function panelRefresh () {
        var directive = {
            controller: Controller,
            restrict: 'A',
            scope: false
        };
        return directive;

    }

    Controller.$inject = ['$scope', '$element'];
    function Controller ($scope, $element) {
      var refreshEvent   = 'panel-refresh',
          whirlClass     = 'whirl',
          defaultSpinner = 'standard';

      // catch clicks to toggle panel refresh
      $element.on('click', function (e) {
        e.preventDefault();

        var $this   = $(this),
            panel   = $this.parents('.panel').eq(0),
            spinner = $this.data('spinner') || defaultSpinner
            ;

        // start showing the spinner
        panel.addClass(whirlClass + ' ' + spinner);

        // Emit event when refresh clicked
        $scope.$emit(refreshEvent, panel.attr('id'));

      });

      // listen to remove spinner
      $scope.$on('removeSpinner', removeSpinner);

      // method to clear the spinner when done
      function removeSpinner (ev, id) {
        if (!id) return;
        var newid = id.charAt(0) === '#' ? id : ('#'+id);
        angular
          .element(newid)
          .removeClass(whirlClass);
      }
    }
})();



/**=========================================================
 * Module panel-tools.js
 * Directive tools to control panels.
 * Allows collapse, refresh and dismiss (remove)
 * Saves panel state in browser storage
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('paneltool', paneltool);

    paneltool.$inject = ['$compile', '$timeout'];
    function paneltool ($compile, $timeout) {
        var directive = {
            link: link,
            restrict: 'E',
            scope: false
        };
        return directive;

        function link(scope, element, attrs) {

          var templates = {
            /* jshint multistr: true */
            collapse:'<a href="#" panel-collapse="" uib-tooltip="Collapse Panel" ng-click="{{panelId}} = !{{panelId}}"> \
                        <em ng-show="{{panelId}}" class="fa fa-plus ng-no-animation"></em> \
                        <em ng-show="!{{panelId}}" class="fa fa-minus ng-no-animation"></em> \
                      </a>',
            dismiss: '<a href="#" panel-dismiss="" uib-tooltip="Close Panel">\
                       <em class="fa fa-times"></em>\
                     </a>',
            refresh: '<a href="#" panel-refresh="" data-spinner="{{spinner}}" uib-tooltip="Refresh Panel">\
                       <em class="fa fa-refresh"></em>\
                     </a>'
          };

          var tools = scope.panelTools || attrs;

          $timeout(function() {
            element.html(getTemplate(element, tools )).show();
            $compile(element.contents())(scope);

            element.addClass('pull-right');
          });

          function getTemplate( elem, attrs ){
            var temp = '';
            attrs = attrs || {};
            if(attrs.toolCollapse)
              temp += templates.collapse.replace(/{{panelId}}/g, (elem.parent().parent().attr('id')) );
            if(attrs.toolDismiss)
              temp += templates.dismiss;
            if(attrs.toolRefresh)
              temp += templates.refresh.replace(/{{spinner}}/g, attrs.toolRefresh);
            return temp;
          }
        }// link
    }

})();

/**=========================================================
 * Module: demo-panels.js
 * Provides a simple demo for panel actions
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .controller('PanelsCtrl', PanelsCtrl);

    PanelsCtrl.$inject = ['$scope', '$timeout'];
    function PanelsCtrl($scope, $timeout) {

        activate();

        ////////////////

        function activate() {

          // PANEL COLLAPSE EVENTS
          // ----------------------------------- 

          // We can use panel id name for the boolean flag to [un]collapse the panel
          $scope.$watch('panelDemo1',function(newVal){
              
              console.log('panelDemo1 collapsed: ' + newVal);

          });


          // PANEL DISMISS EVENTS
          // ----------------------------------- 

          // Before remove panel
          $scope.$on('panel-remove', function(event, id, deferred){
            
            console.log('Panel #' + id + ' removing');
            
            // Here is obligatory to call the resolve() if we pretend to remove the panel finally
            // Not calling resolve() will NOT remove the panel
            // It's up to your app to decide if panel should be removed or not
            deferred.resolve();
          
          });

          // Panel removed ( only if above was resolved() )
          $scope.$on('panel-removed', function(event, id){

            console.log('Panel #' + id + ' removed');

          });


          // PANEL REFRESH EVENTS
          // ----------------------------------- 

          $scope.$on('panel-refresh', function(event, id) {
            var secs = 3;
            
            console.log('Refreshing during ' + secs +'s #'+id);

            $timeout(function(){
              // directive listen for to remove the spinner 
              // after we end up to perform own operations
              $scope.$broadcast('removeSpinner', id);
              
              console.log('Refreshed #' + id);

            }, 3000);

          });

          // PANELS VIA NG-REPEAT
          // ----------------------------------- 

          $scope.panels = [
            {
              id: 'panelRepeat1',
              title: 'Panel Title 1',
              body: 'Nulla eget lorem leo, sit amet elementum lorem. '
            },
            {
              id: 'panelRepeat2',
              title: 'Panel Title 2',
              body: 'Nulla eget lorem leo, sit amet elementum lorem. '
            },
            {
              id: 'panelRepeat3',
              title: 'Panel Title 3',
              body: 'Nulla eget lorem leo, sit amet elementum lorem. '
            }
          ];
        }

    } //PanelsCtrl

})();


/**=========================================================
 * Drag and drop any panel based on jQueryUI portlets
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.panels')
        .directive('portlet', portlet);

    portlet.$inject = ['$timeout', '$localStorage'];
    function portlet ($timeout, $localStorage) {
      var storageKeyName = 'portletState';

      return {
        restrict: 'A',
        link: link
      };

      /////////////

      function link(scope, element) {
          
        // not compatible with jquery sortable
        if(!$.fn.sortable) return;

        element.sortable({
          connectWith:          '[portlet]', // same like directive 
          items:                'div.panel',
          handle:               '.portlet-handler',
          opacity:              0.7,
          placeholder:          'portlet box-placeholder',
          cancel:               '.portlet-cancel',
          forcePlaceholderSize: true,
          iframeFix:            false,
          tolerance:            'pointer',
          helper:               'original',
          revert:               200,
          forceHelperSize:      true,
          update:               savePortletOrder,
          create:               loadPortletOrder
        });

      }


      function savePortletOrder(event/*, ui*/) {
        var self = event.target;
        var data = angular.fromJson($localStorage[storageKeyName]);
        
        if(!data) { data = {}; }

        data[self.id] = $(self).sortable('toArray');

        if(data) {
          $timeout(function() {
            $localStorage[storageKeyName] = angular.toJson(data);
          });
        }
      }

      function loadPortletOrder(event) {
        var self = event.target;
        var data = angular.fromJson($localStorage[storageKeyName]);

        if(data) {
          
          var porletId = self.id,
              panels   = data[porletId];

          if(panels) {
            var portlet = $('#'+porletId);
            
            $.each(panels, function(index, value) {
               $('#'+value).appendTo(portlet);
            });
          }

        }
      }

    }

})();
 
(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name tandemWebApp.controller:ModalConfigurePracticeSetctrl
   * @description
   * # ModalPlayPracticeSetctrl
   * Controller of the tandemWebApp
   */
  angular.module('app.practiceSets').controller('EditPracticeSetModalController', [
    '$scope',
    '$http',
    'Notify',
    'PracticeSet',
    'Question',
    'session',
    'APP_CONFIG',
    'editingSet',
     function (
     $scope,
     $http,
     Notify,
     PracticeSet,
     Question,
     session,
     APP_CONFIG,
     editingSet) {
      var vm = this;

      vm.isAdmin = (session.roles === "admin");
      vm.maxResults = 99999;
      vm.searchParams = null;
      vm.availableQuestions = [];
      vm.selectedQuestion = null;
      vm.newQuestion = {};
      vm.selected = [];
      vm.addedSelected = [];

      vm.practiceSet = editingSet;

      vm.practiceSet.hydrateQuestions().then(function (addedQuestions) {
        vm.practiceSet.questionIds = _.pluck(addedQuestions, '_id'); 
        var where = {
          "_id": { "$nin": vm.practiceSet.questionIds }
        }
        var params = {
          "where": JSON.stringify(where),
          "embedded": { "tags": 1 },
          max_results: vm.maxResults,
        }; 
        Question.getList(params).then(function (questions) {
          vm.totalAvailable = questions._meta.total;
          vm.availableQuestions = questions;
        });
      });

      vm.search = function (added) {
        var speaksFilter = {};
        var learningFilter = {};
        var searchText = (added) ? vm.addedSearchText : vm.searchText;
        var tagsFilter = {
          "tags_index": {
            "$regex": ".*" + searchText + ".*",
            "$options": "i"
          }
        };
        speaksFilter['text.translations.' + session.speaks] = {
          "$regex": ".*" + searchText + ".*",
          "$options": "i"
        };
        learningFilter['text.translations.' + session.learning] = {
          "$regex": ".*" + searchText + ".*",
          "$options": "i"
        };

        if (added) {
          var filter = {
            "$and": [
              { "_id": { "$in": vm.practiceSet.questionIds }},
              { "$or": [ speaksFilter, learningFilter, tagsFilter ] }
            ]
          };
          var params = {
            "where": JSON.stringify(filter),
            "embedded": {
              "tags": 1
            }
          };

          vm.searchParams = params;
          vm.availableQuestions = [];
          Question.getList(params).then(function (questions) {
            vm.addedTotalAvailable = questions._meta.total
            vm.practiceSet.questions = questions;
          });
        } else {
          var filter = {
            "$and": [
              { "_id": { "$nin": vm.practiceSet.questionIds }},
              { "$or": [ speaksFilter, learningFilter, tagsFilter ] }
            ]
          };
          var params = {
            "where": JSON.stringify(filter),
            "embedded": {
              "tags": 1
            }
          };

          vm.searchParams = params;
          vm.availableQuestions = [];
          Question.getList(params).then(function (questions) {
            vm.totalAvailable = questions._meta.total;
            vm.availableQuestions = questions;
          });
        }
      };

      vm.clearNewQuestion = function() {
        vm.newQuestion.speaksText = 'Click here to enter ' + session.speaksText;
        vm.newQuestion.learningText = 'Click here to enter ' + session.learningText;
      };

      /**
       * Submit a new question to the server api using
       * the Question service
       */  
      vm.saveQuestion = function () {
        var translations = {};
        translations[session.speaks] = vm.newQuestion.speaksText;
        translations[session.learning] = vm.newQuestion.learningText;
        var questionData = {
          text: {
            languages: 2,
            original_language: session.speaks,
            translations: translations
          },
          status: 'submitted',
          category: vm.newQuestion.category,
          submitted_by: session.userId
        };

        // add the new question first
        Question.post(questionData).then(function (question) {

          Notify.alert("Question added.", {status: 'success'});

          Question.one(question._id).get().then(function (loadedQuestion) {
            vm.practiceSet.questions.push(loadedQuestion);
        
            // save new question id to practice_set
            var questions = (vm.practiceSet.questions) ?
              _.pluck(vm.practiceSet.questions, '_id') : [];
            questions.push(question._id);
            var practiceSetData = {
              questions: []
            };
            practiceSetData.questions = questions            
            PracticeSet.one(vm.practiceSet._id).patch(practiceSetData).then(function () {
              Notify.alert("Added to PracticeSet", {status: 'success'});
              vm.clearNewQuestion();
            }, function () {
              Notify.alert("Failed to add to PracticeSet", {status: 'danger'});
            });
          }, function (response) {
            Notify.alert("Failed to add to PracticeSet", {status: 'danger'});
          });
        }, function (response) {
          Notify.alert("Server Problem", {status: 'danger'});
        });

      };

      vm.addQuestion = function (question) {
        // save new question id to practice_set
        var questions = (vm.practiceSet.questions) ?
          _.pluck(vm.practiceSet.questions, '_id') : [];
        questions.push(question._id);
        var practiceSetData = {
          questions: []
        };
        practiceSetData.questions = questions
        PracticeSet.one(vm.practiceSet._id).patch(practiceSetData).then(function () {
          Notify.alert("Added to PracticeSet", {status: 'success'});
          vm.practiceSet.questions.push(question);
          vm.availableQuestions = vm.availableQuestions.filter(function (q) {
            return q._id !== question._id;
          });
        }, function () {
          Notify.alert("Failed to add to PracticeSet", {status: 'danger'});
        });
      };

      vm.addAllSelected = function () {
        angular.forEach(vm.availableQuestions, function (question) {
          if (vm.selected.indexOf(question._id) > -1) {
            vm.addQuestion(question);
          }
        });
        // Reset the search, otherwise paging gets weird
        vm.search();
      };

      vm.removeAllSelected = function () {
        angular.forEach(vm.tag.questions, function (question) {
          if (vm.selected.indexOf(question._id) > -1) {
            vm.removeQuestion(question);
          }
        });
        // Reset the search, otherwise paging gets weird
        vm.search();
      };

      vm.removeQuestion = function (question) {
        // save new question id to practice_set
        var questions = (vm.practiceSet.questions) ?
          _.pluck(vm.practiceSet.questions, '_id') : [];
        var practiceSetData = {
          questions: []
        };
        practiceSetData.questions = _.without(questions, question._id);
        PracticeSet.one(vm.practiceSet._id).patch(practiceSetData).then(function () {
          Notify.alert("Added to PracticeSet", {status: 'success'});
          vm.availableQuestions.push(question);
          vm.practiceSet.questions = vm.practiceSet.questions.filter(function (q) {
            return q._id !== question._id;
          });
        }, function () {
          Notify.alert("Failed to add to PracticeSet", {status: 'danger'});
        });
      };

      vm.toggleAll = function () {
        if (vm.allSelected) {
          vm.selected = [];
          vm.allSelected = false;
        } else {
          vm.selected = _.pluck(vm.availableQuestions, '_id');
          vm.allSelected = true;
        }  
      };

      vm.addedToggleAll = function () {
        if (vm.addedAllSelected) {
          vm.addedSelected = [];
          vm.addedAllSelected = false;
        } else {
          vm.addedSelected = _.pluck(vm.practiceSet.questions, '_id');
          vm.addedAllSelected = true;
        }  
      };

      vm.toggleSelected = function (questionId) {
        var idx = vm.selected.indexOf(questionId);
        if (idx > -1) {
          vm.selected.splice(idx, 1);
        } else {
          vm.selected.push(questionId);
        } 
      };

      vm.addedToggleSelected = function (questionId) {
        var idx = vm.addedSelected.indexOf(questionId);
        if (idx > -1) {
          vm.addedSelected.splice(idx, 1);
        } else {
          vm.addedSelected.push(questionId);
        } 
      };

      vm.savePracticeSet = function () {
        var practiceSetData = {};
        
        practiceSetData.category = vm.practiceSet.category;
        practiceSetData.questions = _.pluck(vm.practiceSet.questions, '_id');
        practiceSetData.description = vm.practiceSet.description;
        practiceSetData.title = vm.practiceSet.title;
        PracticeSet.one(vm.practiceSet._id).patch(practiceSetData).then(function() {
          Notify.alert("Practice Set updated.", {status: 'success'});
        }, function () {
          Notify.alert( "Server Problem.", {status: 'success'});
        });
      };

    } // end activate
  ]);
})();

(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name tandemWebApp.controller:ModalPlayPracticeSetctrl
     * @description
     * # ModalPlayPracticeSetctrl
     * Controller of the tandemWebApp
     */
    angular.module('app.practiceSets').controller('PlayMemorizePracticeSetModalController', [
      '$rootScope',
      '$scope',
      'ngAudio',
      'APP_CONFIG',
      'PracticeSet',
      'PracticeSession',
      'Activity',
      'session',
      'playingSet',
      'recorder',
      'speechRecognition',
       function (
        $rootScope,
        $scope, 
        ngAudio,
        APP_CONFIG, 
        PracticeSet, 
        PracticeSession, 
        Activity,
        session,
        playingSet,
        recorder,
        speechRecognition) {
        var self = this;
     
        self.score = 0;
        self.failCatch = null;

        // init speech recognition engine
        // and watch results for display
        // TODO:  IMPORTANT!!!!!!!!!!!!!!
        // it seems that this watch does not work unless 
        // ngAudio is loaded before, even without a url.  No idea why.
        speechRecognition.init(session.speaks);
        if ($rootScope.app.audio.speechRecognition) {
          self.player = ngAudio.load('');
          speechRecognition.results = '...listening';
          speechRecognition.start();
        }
        $scope.$watch(angular.bind(speechRecognition, function () {
          return speechRecognition.results;
        }), function (newVal, oldVal) {
          console.log('got updated speech results');
          self.speechRecognitionResults = newVal;
          if ((self.correctAnswer) && (newVal !== '...listening')) {
            if (newVal.toLowerCase() === self.correctAnswer.toLowerCase()) {
              self.pass = true;
              self.fail = false;
              self.answer = self.correctAnswer;
              self.submitAnswer();
              clearTimeout(self.failCatch);
            } else {
              self.failCatch = setTimeout(function () {
                self.fail = true;
                self.pass = false;
              }, 5000);
            }
          }
        });

        // check if there is an existing practice_session for
        // this practice_set that is still in started states
        self.initPracticeSession = function (practiceSet) {
          self.playedQuestions = [];
          self.completed = false;
          self.showQuestions = false;
          self.audioUrl = null;
          self.recordingQuestion = null;
          self.score = (practiceSet.score) ? practiceSet.score : 0;

          // now loa first question
          PracticeSession.initFromPracticeSet(practiceSet).then(function (practiceSession) {
            practiceSession.initQuestions().then(function () {
              self.practiceSession = practiceSession;
              self.initQuestion();
            });
          });
        };

        // loads random question audio into 
        // audio player for playback
        self.initQuestion = function () {
          self.playedQuestions.push(self.practiceSession.currentQuestion);
          self.correctAnswer = self.practiceSession.currentQuestion.text.translations[session.speaks];
          self.fail = false;
          self.pass = false;
          self.answer = '';
        };

        self.toggleSpeechRecognition = function () {
          $rootScope.app.audio.speechRecognition = !$rootScope.app.audio.speechRecognition;
          if ($rootScope.app.audio.speechRecognition) {
            speechRecognition.results = '...listening';
            speechRecognition.start();
          }
          if (!$rootScope.app.audio.speechRecognition) {
            speechRecognition.stop();
          }
        };

        self.submitAnswer = function () {

          if (self.answer === self.correctAnswer) {
            self.score += Math.floor(100 / self.practiceSession.questions.length);
          } else {
            self.fail = true;
          }

          // push question audio into practiceSession
          // and save the practice session
          self.practiceSession.answers.push(self.practiceSession.currentQuestion._id);
          PracticeSession.one(self.practiceSession._id).patch({
            answers: self.practiceSession.answers,
            score: self.score
          });

          self.loadNextQuestion();
        };

        self.loadNextQuestion = function () {
          // load next question or show complete
          if (self.practiceSession.lastQuestion) {
            self.showComplete = true;
            self.finishPracticeSession();
          } else {
            self.practiceSession.loadNextQuestion().then(function () {
              self.initQuestion();
            });
          }
        };

        self.finishPracticeSession = function () {
          self.practiceSession.status = 'completed';
          self.practiceSession.score = self.score;
          PracticeSession.one(self.practiceSession._id).patch({
            status: self.practiceSession.status
          });
          self.logActivity(); 
        };

        self.logActivity = function () {
          // save user activity
          var activityData = {
            "action": "completed",
            "context": "practice_session",
            "language": session.learning,
            "affected_object": self.practiceSession._id,
            "submitted_by": session.userId
          }
          Activity.post(activityData);
        }

        self.initPracticeSession(playingSet);
       
      }
    ]);
})();


(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name tandemWebApp.controller:ModalPlayPracticeSetctrl
     * @description
     * # ModalPlayPracticeSetctrl
     * Controller of the tandemWebApp
     */
    angular.module('app.practiceSets').controller('PlayTandemPracticeSetModalController', [
      '$scope',
      '$q',
      'APP_CONFIG',
      'Recording',
      'PracticeSet',
      'PracticeSession',
      'Activity',
      'session',
      'playingSet',
      'speechRecognition',
       function (
        $scope, 
        $q,
        APP_CONFIG, 
        Recording, 
        PracticeSet, 
        PracticeSession, 
        Activity,
        session,
        playingSet,
        speechRecognition) {
        var self = this;
     
        self.speaksCode = session.speaks;
        self.learningCode = session.learning;
        self.speaksText = session.speaksText; 
        self.learningText = session.learningText;
        self.speechDetection = false;
        self.showRecorder = false;
        self.showPlayer = true;

        // init speech recognition engine
        // and watch results for display
        speechRecognition.init(self.learningCode);
        $scope.$watch(angular.bind(speechRecognition, function () {
          return speechRecognition.results;
        }), function (newVal, oldVal) {
          self.speechRecognitionResults = newVal;
        });

        // check if there is an existing practice_session for
        // this practice_set that is still in started states
        self.initPracticeSession = function (practiceSet) {
          self.playedQuestions = [];
          self.completed = false;
          self.showQuestions = false;
          self.audioUrl = null;
          self.recordingQuestion = null;

          // now load the first question
          PracticeSession.initFromPracticeSet(practiceSet).then(function (practiceSession) {
            practiceSession.initQuestions().then(function () {
              self.practiceSession = practiceSession;
              self.initQuestion();
            });
          });
        };

        // loads random question audio into 
        // audio player for playback
        self.initQuestion = function () {
          self.showPlayer = true;
          self.practiceSession.currentQuestion.getRecordingUrl(self.learningCode, 'random').then(function (url) {
            self.audioUrl = url;
            self.playedQuestions.push(self.practiceSession.currentQuestion);
          });
        };

        self.toggleSpeechDetection = function () {
          self.speechDetection = !self.speechDetection;
          self.showTranscription = !self.showTranscription;
          if (self.speechDetection) {
            speechRecognition.results = '...listening';
            speechRecognition.start();
          }
          if (!self.speechDetection) {
            speechRecognition.stop();
          }
        };

        self.playerFinished = function () {
          self.showRecorder = true;
        };

        self.recordingStarted = function () {
          self.recordingQuestion = self.practiceSession.currentQuestion;
          //self.showPlayer = false;
        };

        self.audioSaved = function (newRecording) {
          self.showRecorder = false;

          // push question audio into practiceSession
          // and save the practice session
          self.practiceSession.answers.push(self.practiceSession.currentQuestion._id);
          self.practiceSession.audio.push(self.practiceSession.currentQuestion.currentRecording._id);
          self.practiceSession.audio.push(newRecording._id);
          PracticeSession.one(self.practiceSession._id).patch({
            answers: self.practiceSession.answers,
            audio: self.practiceSession.audio,
          });

          // and make question audio the parent of the answer audio
          Recording.one(newRecording._id).patch({
            "parent_audio": self.practiceSession.currentQuestion.currentRecording._id,
            "affected_user": self.practiceSession.currentQuestion.currentRecording.submitted_by
          });

          // load next question or show complete
          if (self.practiceSession.lastQuestion) {
            self.showComplete = true;
          } else {
            self.practiceSession.loadNextQuestion().then(function () {
              self.initQuestion();
            });
          }
        };

        self.savePracticeSession = function () {
          self.practiceSession.status = 'completed';
          PracticeSession.one(self.practiceSession._id).patch({
            status: self.practiceSession.status
          });
          self.logActivity(); 
        };

        self.logActivity = function () {
          // save user activity
          var activityData = {
            "action": "completed",
            "context": "practice_session",
            "language": self.learningCode,
            "affected_object": self.practiceSession._id,
            "submitted_by": session.userId
          }
          Activity.post(activityData);
        }

        self.initPracticeSession(playingSet);
       
      }
    ]);
})();


(function() {
    'use strict';

    angular.module('app.practiceSets').controller('PracticeSetsController', [
      '$scope',
      '$q',
      '$uibModal',
      'RouteHelpers',
      'PracticeSet',
      'APP_CONFIG',
      'session',
      'modalFactory',
      'Notify',
      function PracticeSetsController(
          $scope,
          $q,
          $uibModal,
          helper,
          PracticeSet,
          APP_CONFIG,
          session,
          modalFactory,
          Notify) {
            var self = this;

            activate();

            ////////////////

            function activate() {

              self.session = session;
              self.params = {
                "where": { "submitted_by": session.userId },
                "sort": "_created",
              };

              PracticeSet.getList(self.params).then(function (sets) {
                self.sets = sets; 
              }, function() {
                Notify.alert('There was a problem loading your sets.', {status: 'warning'});
              });

              self.playPracticeSet = function (set) {
                if (set.category === 'tandem') {
                  $uibModal.open({
                    controller: 'PlayTandemPracticeSetModalController',
                    controllerAs: 'modalPlay',
                    templateUrl: 'app/views/modals/play-tandem-practice-set.html',
                    resolve: {
                      playingSet: function () {
                        return set;
                      }
                    },
                    size: 'lg'
                  });
                }
                if (set.category === 'memorize') {
                  // TODO: add memorze session modal opne
                  $uibModal.open({
                    controller: 'PlayMemorizePracticeSetModalController',
                    controllerAs: 'modalPlay',
                    templateUrl: 'app/views/modals/play-memorize-practice-set.html',
                    resolve: {
                      playingSet: function () {
                        return set;
                      }
                    },
                    size: 'lg'
                  });
                }
              };

              self.editPracticeSet = function (set) {
                 $uibModal.open({
                  controller: 'EditPracticeSetModalController',
                  controllerAs: 'modalEdit',
                  templateUrl: 'app/views/modals/edit-practice-set.html',
                  resolve: angular.extend(helper.resolveFor('slimscroll'), {
                    editingSet: function () {
                      return set;
                    }
                  }),
                  size: 'lg'
                });
              };

              self.schedulePracticeSet = function (setId) {
                 $uibModal.open({
                  controller: 'SchedulePracticeSetModalController',
                  controllerAs: 'modalSchedule',
                  templateUrl: 'app/views/modals/schedule-practice-set.html',
                  resolve: {
                    practiceSetId: function () {
                      return setId;
                    }
                  },
                  size: 'lg'
                });
              };

              self.createPracticeSet = function () {
                var description = {};
                description[session.speaks] = self.newSet.description;
                var newSet = {
                  title: self.newSet.title,
                  description: {
                    languages: APP_CONFIG.languages.length,
                    original_language: session.speaks,
                    translations: description
                  },
                  submitted_by: session.userId,
                  category: (self.newSet.category) ? self.newSet.category : 'memorize'
                };

                PracticeSet.post(newSet).then(function (practiceSet) {
                  // TODO: not sure why we don't get all our fields back after a post
                  _.extend(practiceSet, newSet);
                  // add to the sets list
                  self.sets.add(practiceSet);
                  self.clearNewSet();
                  Notify.alert('Practice set added.', {status: 'success'});
                }, function (response) {
                  Notify.alert('There was a problem adding your set.', {status: 'error'});
                });
              };

              self.clearNewSet = function () {
                self.newSet.title = 'Click here to enter title';
                self.newSet.description = 'Click here to enter description';
              }

              self.deletePracticeSet = function (setId) {
                var modal;
                var title = 'Do you really want to delete this Practice Set?';
                var text = 'Questions associated with this ' +
                  'Practice Set can always be re-assigned again.';

                modal = modalFactory.confirmLight(title, text);
                modal.result.then(function () {
                  return PracticeSet.one(setId).remove(setId);
                }, $q.reject)
                .then(function () {
                  Notify.alert("Practice set deleted. However, any questions and audio assocaited with it remain on the server.");
                  _.remove(self.sets, {_id: setId});
                });
              };

            } // end activate
        }
    ]);
})();

(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name tandemWebApp.controller:ModalPlayPracticeSetctrl
   * @description
   * # ModalPlayPracticeSetctrl
   * Controller of the tandemWebApp
   */
  angular.module('app.practiceSets')
  .controller('SchedulePracticeSetModalController', [
    '$scope',
    '$http',
    'Notify',
    'PracticeSet',
    'session',
    'APP_CONFIG',
    'practiceSetId',
     function ($scope, $http, Notify, PracticeSet, session, APP_CONFIG, practiceSetId) {
      var self = this;

      self.format = 'dd-MMMM-yyyy HH:m';
      self.scheduleDate = new Date();
      self.minDate = new Date();
      self.timezone = self.scheduleDate.getTimezoneOffset();
      self.opened = false;
      self.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      self.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        self.opened = true;
      }

      self.saveSchedule = function () {
        // TODO: send user timezone
        var data = {
          "when": self.scheduleDate.toISOString(),
          "user_timezone": self.timezone,
          "repeat": false
        }
        var request = {
          method: 'POST',
          url: APP_CONFIG.API.rootURI + '/mobile/schedule/' + practiceSetId,
          data: data
        }

        $http(request)
        .success(function (response) {
          Notify.alert('Scheduled Save.', {status: 'succes'});
        })
        .error(function (response) {
          Notify.alert('Server Error, Please try again in a moment.', {status: 'error'});
        })
      }
    }
  ]);
})();

(function() {
    'use strict';

    angular
        .module('app.preloader')
        .directive('preloader', preloader);

    preloader.$inject = ['$animate', '$timeout', '$q'];
    function preloader ($animate, $timeout, $q) {

        var directive = {
            restrict: 'EAC',
            template: 
              '<div class="preloader-progress">' +
                  '<div class="preloader-progress-bar" ' +
                       'ng-style="{width: loadCounter + \'%\'}"></div>' +
              '</div>'
            ,
            link: link
        };
        return directive;

        ///////

        function link(scope, el) {

          scope.loadCounter = 0;

          var counter  = 0,
              timeout;

          // disables scrollbar
          angular.element('body').css('overflow', 'hidden');
          // ensure class is present for styling
          el.addClass('preloader');

          appReady().then(endCounter);

          timeout = $timeout(startCounter);

          ///////

          function startCounter() {

            var remaining = 100 - counter;
            counter = counter + (0.015 * Math.pow(1 - Math.sqrt(remaining), 2));

            scope.loadCounter = parseInt(counter, 10);

            timeout = $timeout(startCounter, 20);
          }

          function endCounter() {

            $timeout.cancel(timeout);

            scope.loadCounter = 100;

            $timeout(function(){
              // animate preloader hiding
              $animate.addClass(el, 'preloader-hidden');
              // retore scrollbar
              angular.element('body').css('overflow', '');
            }, 300);
          }

          function appReady() {
            var deferred = $q.defer();
            var viewsLoaded = 0;
            // if this doesn't sync with the real app ready
            // a custom event must be used instead
            var off = scope.$on('$viewContentLoaded', function () {
              viewsLoaded ++;
              // we know there are at least two views to be loaded 
              // before the app is ready (1-index.html 2-app*.html)
              if ( viewsLoaded === 2) {
                // with resolve this fires only once
                $timeout(function(){
                  deferred.resolve();
                }, 3000);

                off();
              }

            });

            return deferred.promise;
          }

        } //link
    }

})();
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

(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name tandemWebApp.controller:AddQuestionAudioModalController
     * @description
     * # ModalAddQuestionCtrl
     * Controller of the tandemWebApp
     */
    angular.module('app.questions').controller('AddQuestionAudioModalController', [
      '$q',
      '$scope',
      'APP_CONFIG',
      'Recording',
      'PracticeSet',
      'session',
      'recordingQuestion',
       function AddQuestionAudioModalController(
        $q,
        $scope,
        APP_CONFIG,
        Recording,
        PracticeSet,
        session,
        recordingQuestion) {
        var self = this;

        self.recordingQuestion = session.recordingQuestion;

        self.learningTabActive = true;
        self.speaksTabActive = false;
        self.practiceSetTabActive = false;
        self.hasSpeaksRecording = false;
        self.hasLearningRecording = false;

        // reset for new question
        var params = {
          "where": {
            "submitted_by": session.userId
           },
           "sort": "_created"
        };
        PracticeSet.getList(params).then(function (practiceSets) {
          self.practiceSets = practiceSets;
        });
        self.recordingQuestion = recordingQuestion;

        // check for audio already
        params = {
          "where": {
            "submitted_by": session.userId,
            "question": self.recordingQuestion._id,
            "context": "question"
          }
        }
        Recording.getList(params).then(function (audios) {
          audios.forEach(function (audio) {
            if (audio.language_code === session.speaks) {
              self.hasSpeaksRecording = true;
              self.speaksTabActive = false;
              self.learningTabActive = true;
              self.speaksRecordingUrl = APP_CONFIG.API.rootURI + '/assets/audio/' + audio._id;
              self.speaksRecording = audio;
            }
            if (audio.language_code === session.learning) {
              self.hasLearningRecording = true;
              self.learningTabActive = false;
              self.speaksTabActive = true;
              self.learningRecordingUrl = APP_CONFIG.API.rootURI + '/assets/audio/' + audio._id;
              self.learningRecording = audio;
            }
            if ((self.hasLearningRecording) && (self.hasSpeaksRecording)) {
              self.practiceSetTabActive = true;
            }
          });
        });

        self.addToPracticeSet = function (practiceSet) {
          if (!practiceSet.questions) {
            practiceSet.questions = [];
          }
          self.recordingQuestion.addToPracticeSet(practiceSet);
          _.remove(self.practiceSets, {_id: practiceSet._id});
        };

        self.learningSaved = function () {
          self.learningTabActive = false;
          self.hasLearningRecording = true;
          self.speaksTabActive = true;
          // add user points
        };

        self.speaksSaved = function () {
          self.speaksTabActive = false;
          self.hasSpeaksRecording = true;
          self.practiceSetTabActive = true;
          // add user points
        };

      }
    ]);
})();

(function() {
    'use strict';

    angular.module('app.questions').controller('CreateQuestionModalController', [
      '$rootScope',
      '$q',
      '$uibModalInstance',
      'Question',
      'session',
      'ngDialog',
      'Notify',
      function CreateQuestionModalController(
          $rootScope,
          $q,
          $uibModalInstance,
          Question,
          session,
          ngDialog,
          Notify) {
            var self = this;

            activate();

            //////////////

            function activate() {
              self.session = session;
 
              self.ok = function () {
                $uibModalInstance.close('closed');
              };

              self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };

               /**
                * set app level transation direction
                * can also be set in settings, and is stored
                * in localStorage
                */
              self.changeTranslationTo = function () {
                self.directionChanged = !self.directionChanged;
                if ($rootScope.app.translation.to === session.learning) {
                  $rootScope.app.translation.to = session.speaks;
                } else {
                  $rootScope.app.translation.to = session.learning;
                }
              };

              /**
               * Submit a new question to the server api using
               * the Question service
               */  
              self.saveQuestion = function () {
                self.direction = !self.direction;
                console.log('bind', self.speaksText, self.learningText);
                return true;

                var translations = {};
                translations[session.speaks] = self.newQuestion.speaksText;
                translations[session.learning] = self.newQuestion.learningText;
                var questionData = {
                  text: {
                    languages: 2,
                    original_language: session.speaks,
                    translations: translations
                  },
                  status: 'submitted',
                  category: self.newQuestion.category,
                  submitted_by: session.userId
                };
                Question.post(questionData).then(function (question) {
                  self.questions.add(question);
                  Notify.alert("Question Added.", {status: 'success'});
                }, function (response) {
                  Notify.alert("Server Problem", {status: 'danger'});
                });

              };

            } // end activate
        }
    ]);
})();

(function() {
    'use strict';

    angular.module('app.questions').controller('QuestionsController', [
      '$scope',
      '$q',
      '$uibModal',
      'RouteHelpers',
      'Question',
      'session',
      'Notify',
      function QuestionsController(
          $scope,
          $q,
          $uibModal,
          helper,
          Question,
          session,
          Notify) {
            var vm = this;

            activate();

            ////////////////

            function activate() {
              vm.page = 1;
              vm.maxResults = 20;
              vm.searchParams = null;
              vm.session = session;

              Question.getList({embedded: {tags: 1}, max_results: vm.maxResults, page: vm.page}).then(function (questions) {
                vm.questions = questions;
              });

              vm.loadMore = function () {
                if (vm.page !== 'end') {
                  var params = {};
                  if (vm.searchParams) {
                    params = searchParams;
                  }
                  params.max_results = vm.maxResults;
                  params.page = (vm.page + 1);
                  params.embedded = {
                    tags: 1
                  }
                  Question.getList(params).then(function (questions) {
                    if (questions) {
                      vm.page++
                      questions.forEach(function (question) {
                        vm.questions.add(question);
                      });
                    } else {
                      vm.page = 'end';
                    }
                  });
                } 
              }

              vm.search = function () {
                var speaksFilter = {};
                var learningFilter = {};
                var tagsFilter = {
                  "tags_index": {
                    "$regex": ".*" + vm.searchText + ".*",
                    "$options": "i"
                  }
                };
                speaksFilter['text.translations.' + session.speaks] = {
                  "$regex": ".*" + vm.searchText + ".*",
                  "$options": "i"
                };
                learningFilter['text.translations.' + session.learning] = {
                "$regex": ".*" + vm.searchText + ".*",
                "$options": "i"
              };
              var filter = {
                "$or": [
                  speaksFilter,
                  learningFilter,
                  tagsFilter
                ]
              };
              var params = {
                "where": JSON.stringify(filter),
                "embedded": {
                  "tags": 1
                }
              };

              vm.searchParams = params;
              Question.getList(params).then(function (questions) {
                vm.page = 1;
                vm.questions = questions;
              });

            };

            vm.openCreateQuestionModal = function () {
              var modalInstance = $uibModal.open({
                templateUrl: 'app/views/modals/create-question.html',
                controller: 'CreateQuestionModalController',
                controllerAs: 'createQuestion',
                size: 'lg'
              });

              var state = $('#modal-state');
              modalInstance.result.then(function () {
                console.log('dismissed with OK');
                // add question to questions list
              }, function () {
                console.log('dismissed with Cancel');
              });  
            };

            vm.openAddQuestionAudioModal = function (question) {
              var modalInstance = $uibModal.open({
                templateUrl: 'app/views/modals/add-question-audio.html',
                controller: 'AddQuestionAudioModalController',
                controllerAs: 'addAudio',
                resolve: {
                  recordingQuestion: function () {
                    return question;
                  }
                },
                size: 'lg'
              });

              var state = $('#modal-state');
              modalInstance.result.then(function () {
                console.log('dismissed with OK');
                // update question in questions list
              }, function () {
                console.log('dismissed with Cancel');
              });  
            };

            vm.openImageSelectModal = function (question) {
              var modalInstance = $uibModal.open({
                templateUrl: 'app/views/modals/image-select.html',
                controller: 'ImageSelectModalController',
                controllerAs: 'imageSelect',
                resolve: {
                  referenceObject: function () {
                    return question;
                  }
                },
                size: 'lg'
              });

              var state = $('#modal-state');
              modalInstance.result.then(function () {
                console.log('dismissed with OK');
                // update question in questions list
              }, function () {
                console.log('dismissed with Cancel');
              });  
            };

          } // end activate
        }
    ]);
})();

/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.routes')
        .provider('RouteHelpers', RouteHelpersProvider)
        ;

    RouteHelpersProvider.$inject = ['APP_REQUIRES'];
    function RouteHelpersProvider(APP_REQUIRES) {

      /* jshint validthis:true */
      return {
        // provider access level
        basepath: basepath,
        resolveFor: resolveFor,
        // controller access level
        $get: function() {
          return {
            basepath: basepath,
            resolveFor: resolveFor
          };
        }
      };

      // Set here the base of the relative path
      // for all app views
      function basepath(uri) {
        return 'app/views/' + uri;
      }

      // Generates a resolve object by passing script names
      // previously configured in constant.APP_REQUIRES
      function resolveFor() {
        var _args = arguments;
        return {
          deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
            // Creates a promise chain for each argument
            var promise = $q.when(1); // empty promise
            for(var i=0, len=_args.length; i < len; i ++){
              promise = andThen(_args[i]);
            }
            return promise;

            // creates promise to chain dynamically
            function andThen(_arg) {
              // also support a function that returns a promise
              if(typeof _arg === 'function')
                  return promise.then(_arg);
              else
                  return promise.then(function() {
                    // if is a module, pass the name. If not, pass the array
                    var whatToLoad = getRequired(_arg);
                    // simple error check
                    if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                    // finally, return a promise
                    return $ocLL.load( whatToLoad );
                  });
            }
            // check and returns required data
            // analyze module items with the form [name: '', files: []]
            // and also simple array of script files (for not angular js)
            function getRequired(name) {
              if (APP_REQUIRES.modules)
                  for(var m in APP_REQUIRES.modules)
                      if(APP_REQUIRES.modules[m].name && APP_REQUIRES.modules[m].name === name)
                          return APP_REQUIRES.modules[m];
              return APP_REQUIRES.scripts && APP_REQUIRES.scripts[name];
            }

          }]};
      } // resolveFor

    }


})();


/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/app/dashboard');

        // 
        // Application Routes
        // -----------------------------------   
        $stateProvider
          .state('app', {
              url: '/app',
              abstract: true,
              templateUrl: helper.basepath('app.html'),
              resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
          })
          .state('app.dashboard', {
              url: '/dashboard',
              title: 'Dashboard',
              templateUrl: helper.basepath('dashboard.html'),
              resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
          })
          .state('app.practice-sets', {
              url: '/practice-sets',
              title: 'Practice Sets',
              templateUrl: helper.basepath('practice-sets.html'),
              resolve: helper.resolveFor('ngDialog')
          })
          .state('app.questions', {
              url: '/questions',
              title: 'Questions',
              templateUrl: helper.basepath('questions.html'),
              resolve: helper.resolveFor('ngDialog', 'infinite-scroll')
          })
          .state('app.tags', {
              url: '/tags',
              title: 'Tags',
              templateUrl: helper.basepath('tags.html'),
              resolve: helper.resolveFor('ngDialog')
          })
          .state('app.singleview', {
              url: '/singleview',
              title: 'Single View',
              templateUrl: helper.basepath('singleview.html')
          })
          .state('app.chart-flot', {
              url: '/chart-flot',
              title: 'Chart Flot',
              templateUrl: helper.basepath('chart-flot.html'),
              resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
          })
          .state('app.icons-weather', {
              url: '/icons-weather',
              title: 'Icons Weather',
              templateUrl: helper.basepath('icons-weather.html'),
              resolve: helper.resolveFor('weather-icons', 'skycons')
          })
          .state('app.profile', {
              url: '/profile',
              title: 'Profile',
              templateUrl: helper.basepath('profile.html'),
              resolve: helper.resolveFor('ngImgCrop', 'filestyle', 'ngDialog', 'moment', 'xeditable', 'ui.map')
          })
          //
          // Admin Page Routes
          // -----------------------------------
          .state('admin', {
              url: '/admin',
              abstract: true,
              templateUrl: helper.basepath('app.html'),
              resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
          })
          .state('admin.practice-sessions', {
              url: '/practice-sessions',
              title: 'Practice Sessions',
              templateUrl: helper.basepath('admin/practice-sessions.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.practice-sets', {
              url: '/practice-sets',
              title: 'Practice Sets',
              templateUrl: helper.basepath('admin/practice-sets.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.questions', {
              url: '/questions',
              title: 'Questions',
              templateUrl: helper.basepath('admin/questions.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.tags', {
              url: '/tags',
              title: 'Tags',
              templateUrl: helper.basepath('admin/tags.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.audio', {
              url: '/audio',
              title: 'Audio',
              templateUrl: helper.basepath('admin/audio.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.users', {
              url: '/users',
              title: 'Users',
              templateUrl: helper.basepath('admin/users.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.ratings', {
              url: '/ratings',
              title: 'Ratings',
              templateUrl: helper.basepath('admin/ratings.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          .state('admin.comments', {
              url: '/comments',
              title: 'Comments',
              templateUrl: helper.basepath('admin/comments.html'),
              resolve: helper.resolveFor('angularGrid')
          })
          //
          // Single Page Routes
          // -----------------------------------
          .state('page', {
              url: '/page',
              templateUrl: 'app/pages/page.html',
              resolve: helper.resolveFor('modernizr', 'icons'),
              controller: ['$rootScope', function($rootScope) {
                  $rootScope.app.layout.isBoxed = false;
              }]
          })
          .state('page.login', {
              url: '/login',
              title: 'Login',
              templateUrl: 'app/pages/login.html'
          })
          .state('page.register', {
              url: '/register',
              title: 'Register',
              templateUrl: 'app/pages/register.html'
          })
          .state('page.recover', {
              url: '/recover',
              title: 'Recover',
              templateUrl: 'app/pages/recover.html'
          })
          .state('page.lock', {
              url: '/lock',
              title: 'Lock',
              templateUrl: 'app/pages/lock.html'
          })
          .state('page.404', {
              url: '/404',
              title: 'Not Found',
              templateUrl: 'app/pages/404.html'
          })
          ;

    } // routesConfig

})();


(function() {
    'use strict';

    angular.module('app.session').service('session', [
        '$localStorage',
        '$rootScope',
        '$q',
        '$http',
        '$window',
        '$location',
        'APP_CONFIG',
        'User',
        function (
            $localStorage,
            $rootScope,
            $q,
            $http,
            $window,
            $location,
            APP_CONFIG,
            User) {
            var self = this;

            self.fields = {
                'token': null,
                'isAuthenticated': null, 
                'userId': null, 
                'username': null, 
                'roles': null, 
                'speaks': null, 
                'learning': null, 
                'speaksText': null, 
                'learningText': null, 
                'profileImage': null, 
                'user': null
            };

            self.init = function () {
                self.token = $window.sessionStorage.getItem('token');
                self.isAuthenticated = !!$window.sessionStorage.getItem('token');
                self.userId = $window.sessionStorage.getItem('user_id');
                self.username = ($window.sessionStorage.getItem('username')) ? 
                    $window.sessionStorage.getItem('username'): null;
                self.roles = $window.sessionStorage.getItem('roles');
                self.speaks = $window.sessionStorage.getItem('speaks');
                self.learning = $window.sessionStorage.getItem('learning');
                self.speaksText = $window.sessionStorage.getItem('speaksText');
                self.learningText = $window.sessionStorage.getItem('learningText');
                self.profileImage = $window.sessionStorage.getItem('profile_image');
                self.picture = $window.sessionStorage.getItem('picture');
                self.name = $window.sessionStorage.getItem('name');
                if (!self.user && self.token) {
                    // get the user from the server
                    User.initUser(self.userId).then(function (user) {

                        console.log('re-initializing session user');

                        self.setLocaleLanguages(user);
                        // now set values we got from User model
                        $window.sessionStorage.setItem('profile_image', user.image);
                        $window.sessionStorage.setItem('picture', 'data:image/png;base64,' + user.image);
                        $window.sessionStorage.setItem('name', user.first_name);
                        self.user = user;

                        // now save ALL values to this object 
                        self.init();
                        
                        return true;
                    }, function (response) {
                        return false;
                    });
                }

                $rootScope.session = self;

                return true; 
            };

            self.init();

            self.newTokenByLogin = function(username, password) {
                var deferredPost = $q.defer();
                var request = {
                    method: 'POST',
                    url: APP_CONFIG.API.rootURI + '/login',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    data: {
                        "username": username,
                        "password": password
                    }
                };

                $http(request)
                .success(function (response) {
                    if (response.status) {
                        self.setSessionStorage(response).then(function () {
                            deferredPost.resolve(response);
                        });
                    } else {
                        self.clear();
                        deferredPost.reject(response);
                    }
                }).error(function (responseBody) {
                    self.clear();
                    deferredPost.reject(responseBody);
                }); 

                return deferredPost.promise; 
            };

            self.setLocaleLanguages = function (session) {
                // TODO: this doesnt work for some reason
                // I get no value from localStorae, even though I
                // can plainly see it in my browser
                var locale = ($localStorage['NG_TRANSLATE_LANG_KEY']) ?
                    $localStorage['NG_TRANSLATE_LANG_KEY'].substring(0,2) : session.speaks[0];
                var spath = APP_CONFIG.languages.filter(function(l) {
                    return l.code === session.speaks[0] 
                });
                var lpath = APP_CONFIG.languages.filter(function(l) {
                    return l.code === session.learning[0] 
                });
                var speaks = spath[0].text.translations;
                var learning = lpath[0].text.translations;

                // use locale set by app instead of speaks
                var speaksText = speaks[locale];
                var learningText = learning[locale];

                $window.sessionStorage.setItem('speaksText', speaksText);
                $window.sessionStorage.setItem('learningText', learningText);
            }

            self.setSessionStorage = function (session) {
                var deferedGet = $q.defer(); 
                // first set values we get directly from server session
                $window.sessionStorage.setItem('token', btoa(session.token + ':'));
                $window.sessionStorage.setItem('user_id', session.user);
                $window.sessionStorage.setItem('username', session.username);
                $window.sessionStorage.setItem('roles', session.roles[0]);
                $window.sessionStorage.setItem('speaks', session.speaks[0]);
                $window.sessionStorage.setItem('learning', session.learning[0]);
                
                // now set text string language based on app locale
                self.setLocaleLanguages(session);

                // now set these so that our api calls will be
                // authenticated by authInterceptor
                self.token = $window.sessionStorage.getItem('token');
                self.userId = $window.sessionStorage.getItem('user_id');

                User.initUser(self.userId).then(function (user) {
                    // now set values we got from User model
                    $window.sessionStorage.setItem('profile_image', user.image);
                    $window.sessionStorage.setItem('name', user.first_name);
                    self.user = user;
                    // now save ALL values to this object 
                    self.init();
                    deferedGet.resolve(user);
                }, function (response) {
                    deferedGet.reject(response);
                });

                return deferedGet.promise;
            };
 
            // used is various parts of the app 
            // when a logged in user updates profile
            // data, this just updates the sessionStore values
            // with latest data from the server 
            this.updateIdentity = function () {
              var deferedGet = $q.defer(); 

              // call User.initUser, then self.init()
              User.initUser(self.userId).then(function (user) {
                  // now set values we got from User model
                  $window.sessionStorage.setItem('profile_image', user.image);
                  $window.sessionStorage.setItem('roles', user.roles[0]);
                  $window.sessionStorage.setItem('speaks', user.speaks[0]);
                  $window.sessionStorage.setItem('learning', user.learning[0]);
                  APP_CONFIG.languages.forEach(function (language) {
                    if (language.code === user.speaks[0]) {
                        $window.sessionStorage.setItem('speaksText', language.text.translations[user.speaks[0]]);
                    }
                    if (language.code === user.learning[0]) {
                        $window.sessionStorage.setItem('learningText', language.text.translations[user.speaks[0]]);
                    }
                  });
                  self.user = user;
                  // now save ALL values to this object 
                  self.init();
                  deferedGet.resolve(user);
              }, function (response) {
                  deferedGet.reject(response);
              });

              return deferedGet.promise;
            };

            // Used when a logged in user updates their image
            self.updateImage = function (image) {
                $window.sessionStorage.setItem('profile_image', image);
                self.profileImage = $window.sessionStorage.getItem('profile_image');
            };

            /**
             * Used to logout
             * makes call to the api to clear the server session
             * clears out sessionStorage, and this objects vars
             */
            self.clear = function() {
                var deferredPost = $q.defer();
                var request = {
                  method: 'POST',
                  url: APP_CONFIG.API.rootURI + '/logout',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  data: {
                      "username": self.username
                  }
                };

                $http(request)
                .success(function (response) {
                    $window.sessionStorage.removeItem('token');
                    $window.sessionStorage.removeItem('username');
                    $window.sessionStorage.removeItem('user_id');
                    $window.sessionStorage.removeItem('roles');
                    $window.sessionStorage.removeItem('speaks');
                    $window.sessionStorage.removeItem('learning');
                    $window.sessionStorage.removeItem('learningText');
                    $window.sessionStorage.removeItem('speaksText');
                    $window.sessionStorage.removeItem('profile_image');

                    self.token = null; 
                    self.isAuthenticated = false; 
                    self.username = null; 
                    self.userId = null;
                    self.user = null;
                    self.profileImage = null;
                    self.roles = null;
                    self.speaks = null;
                    self.learning = null;
                    self.speaksText = null;
                    self.learningText = null;
              
                    $location.path( "/" );

                    deferredPost.resolve();
                }).error(function (responseBody) {
                    deferredPost.reject(responseBody);
                }); 

                return deferredPost.promise; 
            };

        }
            ]
        );
})();

(function() {
    'use strict';

    angular
        .module('app.settings')
        .run(settingsRun);

    settingsRun.$inject = ['$rootScope', '$localStorage'];

    function settingsRun($rootScope, $localStorage){

      // Global Settings
      // -----------------------------------
      $rootScope.app = {
        name: 'Tandem',
        description: 'Language Practice App',
        year: ((new Date()).getFullYear()),
        debug: true,
        layout: {
          isFixed: true,
          isCollapsed: false,
          isBoxed: false,
          isRTL: false,
          horizontal: false,
          isFloat: false,
          asideHover: false,
          theme: null,
          asideScrollbar: false
        },
        translation: {
          mymemory: true,
          duolingo: true,
          googleSearch: true,
          leoLink: true,
          to: 'en',
          show: true
        },
        useFullLayout: false,
        hiddenFooter: false,
        offsidebarOpen: false,
        asideToggled: false,
        viewAnimation: 'ng-fadeInUp',
        audio: {
          speechRecognition: true
        }
      };

      // Setup the layout mode
      $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout === 'app-h') ;

      // Restore layout settings
      if( angular.isDefined($localStorage.layout) )
        $rootScope.app.layout = $localStorage.layout;
      else
        $localStorage.layout = $rootScope.app.layout;

      $rootScope.$watch('app.layout', function () {
        $localStorage.layout = $rootScope.app.layout;
      }, true);

      // Restore translation settings
      if( angular.isDefined($localStorage.translation) )
        $rootScope.app.translation = $localStorage.translation;
      else
        $localStorage.translation = $rootScope.app.translation;

      $rootScope.$watch('app.translation', function () {
        $localStorage.translation = $rootScope.app.translation;
      }, true);

      // Restore audio settings
      if( angular.isDefined($localStorage.audio) )
        $rootScope.app.audio = $localStorage.audio;
      else
        $localStorage.audio = $rootScope.app.audio;

      $rootScope.$watch('app.audio', function () {
        $localStorage.audio = $rootScope.app.audio;
      }, true);

      // Close submenu when sidebar change from collapsed to normal
      $rootScope.$watch('app.layout.isCollapsed', function(newValue) {
        if( newValue === false )
          $rootScope.$broadcast('closeSidebarMenu');
      });

    }

})();

/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$rootScope', '$scope', '$state', 'SidebarLoader', 'Utils'];
    function SidebarController($rootScope, $scope, $state, SidebarLoader,  Utils) {

        activate();

        ////////////////

        function activate() {
          var collapseList = [];

          // demo: when switch from collapse to hover, close all items
          $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal){
            if ( newVal === false && oldVal === true) {
              closeAllBut(-1);
            }
          });


          // Load menu from json file
          // ----------------------------------- 

          SidebarLoader.getMenu(sidebarReady);
          
          function sidebarReady(items) {
            // TODO: filter out admin items
            $scope.menuItems = items;
          }

          // Handle sidebar and collapse items
          // ----------------------------------
          
          $scope.getMenuItemPropClasses = function(item) {
            return (item.heading ? 'nav-heading' : '') +
                   (isActive(item) ? ' active' : '') ;
          };

          $scope.addCollapse = function($index, item) {
            collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
          };

          $scope.isCollapse = function($index) {
            return (collapseList[$index]);
          };

          $scope.toggleCollapse = function($index, isParentItem) {

            // collapsed sidebar doesn't toggle drodopwn
            if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) return true;

            // make sure the item index exists
            if( angular.isDefined( collapseList[$index] ) ) {
              if ( ! $scope.lastEventFromChild ) {
                collapseList[$index] = !collapseList[$index];
                closeAllBut($index);
              }
            }
            else if ( isParentItem ) {
              closeAllBut(-1);
            }
            
            $scope.lastEventFromChild = isChild($index);

            return true;
          
          };

          // Controller helpers
          // ----------------------------------- 

            // Check item and children active state
            function isActive(item) {

              if(!item) return;

              if( !item.sref || item.sref === '#') {
                var foundActive = false;
                angular.forEach(item.submenu, function(value) {
                  if(isActive(value)) foundActive = true;
                });
                return foundActive;
              }
              else
                return $state.is(item.sref) || $state.includes(item.sref);
            }

            function closeAllBut(index) {
              index += '';
              for(var i in collapseList) {
                if(index < 0 || index.indexOf(i) < 0)
                  collapseList[i] = true;
              }
            }

            function isChild($index) {
              /*jshint -W018*/
              return (typeof $index === 'string') && !($index.indexOf('-') < 0);
            }
        
        } // activate
    }

})();

/**=========================================================
 * Module: sidebar.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .directive('sidebar', sidebar);

    sidebar.$inject = ['$rootScope', '$timeout', '$window', 'Utils'];
    function sidebar ($rootScope, $timeout, $window, Utils) {
        var $win = angular.element($window);
        var directive = {
            // bindToController: true,
            // controller: Controller,
            // controllerAs: 'vm',
            link: link,
            restrict: 'EA',
            template: '<nav class="sidebar" ng-transclude></nav>',
            transclude: true,
            replace: true
            // scope: {}
        };
        return directive;

        function link(scope, element, attrs) {

          var currentState = $rootScope.$state.current.name;
          var $sidebar = element;

          var eventName = Utils.isTouch() ? 'click' : 'mouseenter' ;
          var subNav = $();

          $sidebar.on( eventName, '.nav > li', function() {

            if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) {

              subNav.trigger('mouseleave');
              subNav = toggleMenuItem( $(this), $sidebar);

              // Used to detect click and touch events outside the sidebar          
              sidebarAddBackdrop();

            }

          });

          scope.$on('closeSidebarMenu', function() {
            removeFloatingNav();
          });

          // Normalize state when resize to mobile
          $win.on('resize', function() {
            if( ! Utils.isMobile() )
          	asideToggleOff();
          });

          // Adjustment on route changes
          $rootScope.$on('$stateChangeStart', function(event, toState) {
            currentState = toState.name;
            // Hide sidebar automatically on mobile
            asideToggleOff();

            $rootScope.$broadcast('closeSidebarMenu');
          });

      	  // Autoclose when click outside the sidebar
          if ( angular.isDefined(attrs.sidebarAnyclickClose) ) {
            
            var wrapper = $('.wrapper');
            var sbclickEvent = 'click.sidebar';
            
            $rootScope.$watch('app.asideToggled', watchExternalClicks);

          }

          //////

          function watchExternalClicks(newVal) {
            // if sidebar becomes visible
            if ( newVal === true ) {
              $timeout(function(){ // render after current digest cycle
                wrapper.on(sbclickEvent, function(e){
                  // if not child of sidebar
                  if( ! $(e.target).parents('.aside').length ) {
                    asideToggleOff();
                  }
                });
              });
            }
            else {
              // dettach event
              wrapper.off(sbclickEvent);
            }
          }

          function asideToggleOff() {
            $rootScope.app.asideToggled = false;
            if(!scope.$$phase) scope.$apply(); // anti-pattern but sometimes necessary
      	  }
        }
        
        ///////

        function sidebarAddBackdrop() {
          var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop'} );
          $backdrop.insertAfter('.aside-inner').on('click mouseenter', function () {
            removeFloatingNav();
          });
        }

        // Open the collapse sidebar submenu items when on touch devices 
        // - desktop only opens on hover
        function toggleTouchItem($element){
          $element
            .siblings('li')
            .removeClass('open')
            .end()
            .toggleClass('open');
        }

        // Handles hover to open items under collapsed menu
        // ----------------------------------- 
        function toggleMenuItem($listItem, $sidebar) {

          removeFloatingNav();

          var ul = $listItem.children('ul');
          
          if( !ul.length ) return $();
          if( $listItem.hasClass('open') ) {
            toggleTouchItem($listItem);
            return $();
          }

          var $aside = $('.aside');
          var $asideInner = $('.aside-inner'); // for top offset calculation
          // float aside uses extra padding on aside
          var mar = parseInt( $asideInner.css('padding-top'), 0) + parseInt( $aside.css('padding-top'), 0);
          var subNav = ul.clone().appendTo( $aside );
          
          toggleTouchItem($listItem);

          var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
          var vwHeight = $win.height();

          subNav
            .addClass('nav-floating')
            .css({
              position: $rootScope.app.layout.isFixed ? 'fixed' : 'absolute',
              top:      itemTop,
              bottom:   (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
            });

          subNav.on('mouseleave', function() {
            toggleTouchItem($listItem);
            subNav.remove();
          });

          return subNav;
        }

        function removeFloatingNav() {
          $('.dropdown-backdrop').remove();
          $('.sidebar-subnav.nav-floating').remove();
          $('.sidebar li.open').removeClass('open');
        }
    }


})();


(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);

    SidebarLoader.$inject = ['$http'];
    function SidebarLoader($http) {
        this.getMenu = getMenu;

        ////////////////

        function getMenu(onReady, onError) {
          var menuJson = 'server/sidebar-menu.json',
              menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache
            
          onError = onError || function() { alert('Failure loading menu'); };

          $http
            .get(menuURL)
            .success(onReady)
            .error(onError);
        }
    }
})();
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

/**=========================================================
 * Module: angular-grid.js
 * Example for Angular Grid
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.tables')
        .controller('AngularGridController', AngularGridController);

    AngularGridController.$inject = ['$http'];
    function AngularGridController($http) {
        var vm = this;

        activate();

        ////////////////

        function activate() {

            // Basic
            var columnDefs = [
                {headerName: 'Athlete', field: 'athlete', width: 150},
                {headerName: 'Age', field: 'age', width: 90},
                {headerName: 'Country', field: 'country', width: 120},
                {headerName: 'Year', field: 'year', width: 90},
                {headerName: 'Date', field: 'date', width: 110},
                {headerName: 'Sport', field: 'sport', width: 110},
                {headerName: 'Gold', field: 'gold', width: 100},
                {headerName: 'Silver', field: 'silver', width: 100},
                {headerName: 'Bronze', field: 'bronze', width: 100},
                {headerName: 'Total', field: 'total', width: 100}
            ];

            vm.gridOptions = {
                columnDefs: columnDefs,
                rowData: null,
                ready: function(api){
                  api.sizeColumnsToFit();
                }
            };

            // Filter Example
            var irishAthletes = ['John Joe Nevin','Katie Taylor','Paddy Barnes','Kenny Egan','Darren Sutherland', 'Margaret Thatcher', 'Tony Blair', 'Ronald Regan', 'Barack Obama'];

            var columnDefsFilter = [
                {headerName: 'Athlete', field: 'athlete', width: 150, filter: 'set',
                    filterParams: { cellHeight: 20, values: irishAthletes} },
                {headerName: 'Age', field: 'age', width: 90, filter: 'number'},
                {headerName: 'Country', field: 'country', width: 120},
                {headerName: 'Year', field: 'year', width: 90},
                {headerName: 'Date', field: 'date', width: 110},
                {headerName: 'Sport', field: 'sport', width: 110},
                {headerName: 'Gold', field: 'gold', width: 100, filter: 'number'},
                {headerName: 'Silver', field: 'silver', width: 100, filter: 'number'},
                {headerName: 'Bronze', field: 'bronze', width: 100, filter: 'number'},
                {headerName: 'Total', field: 'total', width: 100, filter: 'number'}
            ];

            vm.gridOptions1 = {
                columnDefs: columnDefsFilter,
                rowData: null,
                enableFilter: true,
                ready: function(api){
                  api.sizeColumnsToFit();
                }

            };


            // Pinning Example

            vm.gridOptions2 = {
                columnDefs: columnDefs,
                rowData: null,
                pinnedColumnCount: 2,
                ready: function(api){
                  api.sizeColumnsToFit();
                }
            };

            //-----------------------------
            // Get the data from SERVER
            //-----------------------------

            $http.get('server/ag-owinners.json')
                .then(function(res){
                    // basic
                    vm.gridOptions.api.setRowData(res.data);
                    vm.gridOptions.api.sizeColumnsToFit();
                    // filter
                    vm.gridOptions1.api.setRowData(res.data);
                    vm.gridOptions1.api.sizeColumnsToFit();

                    // pinning
                    vm.gridOptions2.api.setRowData(res.data);
                    vm.gridOptions2.api.sizeColumnsToFit();
                });

        }
    }
})();

/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.tables')
        .controller('DataTableController', DataTableController);

    DataTableController.$inject = ['$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder'];
    function DataTableController($resource, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;

        activate();

        ////////////////

        function activate() {

          // Ajax

          $resource('server/datatable.json').query().$promise.then(function(persons) {
             vm.persons = persons;
          });

          // Changing data

          vm.heroes = [{
              'id': 860,
              'firstName': 'Superman',
              'lastName': 'Yoda'
            }, {
              'id': 870,
              'firstName': 'Ace',
              'lastName': 'Ventura'
            }, {
              'id': 590,
              'firstName': 'Flash',
              'lastName': 'Gordon'
            }, {
              'id': 803,
              'firstName': 'Luke',
              'lastName': 'Skywalker'
            }
          ];

          vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
          vm.dtColumnDefs = [
              DTColumnDefBuilder.newColumnDef(0),
              DTColumnDefBuilder.newColumnDef(1),
              DTColumnDefBuilder.newColumnDef(2),
              DTColumnDefBuilder.newColumnDef(3).notSortable()
          ];
          vm.person2Add = _buildPerson2Add(1);
          vm.addPerson = addPerson;
          vm.modifyPerson = modifyPerson;
          vm.removePerson = removePerson;

          function _buildPerson2Add(id) {
              return {
                  id: id,
                  firstName: 'Foo' + id,
                  lastName: 'Bar' + id
              };
          }
          function addPerson() {
              vm.heroes.push(angular.copy(vm.person2Add));
              vm.person2Add = _buildPerson2Add(vm.person2Add.id + 1);
          }
          function modifyPerson(index) {
              vm.heroes.splice(index, 1, angular.copy(vm.person2Add));
              vm.person2Add = _buildPerson2Add(vm.person2Add.id + 1);
          }
          function removePerson(index) {
              vm.heroes.splice(index, 1);
          }

        }
    }
})();

/**=========================================================
 * Module: ng-grid.js
 * ngGrid demo
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.tables')
        .controller('NGGridController', NGGridController);

    NGGridController.$inject = ['$scope', '$http', '$timeout'];
    function NGGridController($scope, $http, $timeout) {

        activate();

        ////////////////

        function activate() {

          $scope.filterOptions = {
              filterText: '',
              useExternalFilter: true
          };
          $scope.totalServerItems = 0;
          $scope.pagingOptions = {
              pageSizes:   [250, 500, 1000],  // page size options
              pageSize:    250,              // default page size
              currentPage: 1                 // initial page
          };

          $scope.gridOptions = {
              data:             'myData',
              enablePaging:     true,
              showFooter:       true,
              rowHeight:        36,
              headerRowHeight:  38,
              totalServerItems: 'totalServerItems',
              pagingOptions:    $scope.pagingOptions,
              filterOptions:    $scope.filterOptions
          };

          $scope.setPagingData = function(data, page, pageSize){
              // calc for pager
              var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
              // Store data from server
              $scope.myData = pagedData;
              // Update server side data length
              $scope.totalServerItems = data.length;

              if (!$scope.$$phase) {
                  $scope.$apply();
              }

          };

          $scope.getPagedDataAsync = function (pageSize, page, searchText) {
            var ngGridResourcePath = 'server/ng-grid-data.json';

            $timeout(function () {

                if (searchText) {
                    var ft = searchText.toLowerCase();
                    $http.get(ngGridResourcePath).success(function (largeLoad) {
                        var data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) !== -1;
                        });
                        $scope.setPagingData(data,page,pageSize);
                    });
                } else {
                    $http.get(ngGridResourcePath).success(function (largeLoad) {
                        $scope.setPagingData(largeLoad,page,pageSize);
                    });
                }
            }, 100);
          };


          $scope.$watch('pagingOptions', function (newVal, oldVal) {
              if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
              }
          }, true);
          $scope.$watch('filterOptions', function (newVal, oldVal) {
              if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
              }
          }, true);

          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.tables')
        .service('ngTableDataService', ngTableDataService);

    function ngTableDataService() {
        /* jshint validthis:true */
        var self = this;
        this.cache = null;
        this.getData = getData;

        ////////////////

        function getData($defer, params, api) {
          // if no cache, request data and filter
          if ( ! self.cache ) {
            if ( api ) {
              api.get(function(data){
                self.cache = data;
                filterdata($defer, params);
              });
            }
          }
          else {
            filterdata($defer, params);
          }
          
          function filterdata($defer, params) {
            var from = (params.page() - 1) * params.count();
            var to = params.page() * params.count();
            var filteredData = self.cache.result.slice(from, to);

            params.total(self.cache.total);
            $defer.resolve(filteredData);
          }

        }
    }
})();

/**=========================================================
 * Module: NGTableCtrl.js
 * Controller for ngTables
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.tables')
        .controller('NGTableCtrl', NGTableCtrl);
    /*jshint -W055 */
    NGTableCtrl.$inject = ['$filter', 'ngTableParams', '$resource', '$timeout', 'ngTableDataService'];
    function NGTableCtrl($filter, ngTableParams, $resource, $timeout, ngTableDataService) {
        var vm = this;
        vm.title = 'Controller';

        activate();

        ////////////////

        function activate() {
          var data = [
              {name: 'Moroni',  age: 50, money: -10   },
              {name: 'Tiancum', age: 43, money: 120   },
              {name: 'Jacob',   age: 27, money: 5.5   },
              {name: 'Nephi',   age: 29, money: -54   },
              {name: 'Enos',    age: 34, money: 110   },
              {name: 'Tiancum', age: 43, money: 1000  },
              {name: 'Jacob',   age: 27, money: -201  },
              {name: 'Nephi',   age: 29, money: 100   },
              {name: 'Enos',    age: 34, money: -52.5 },
              {name: 'Tiancum', age: 43, money: 52.1  },
              {name: 'Jacob',   age: 27, money: 110   },
              {name: 'Nephi',   age: 29, money: -55   },
              {name: 'Enos',    age: 34, money: 551   },
              {name: 'Tiancum', age: 43, money: -1410 },
              {name: 'Jacob',   age: 27, money: 410   },
              {name: 'Nephi',   age: 29, money: 100   },
              {name: 'Enos',    age: 34, money: -100  }
          ];

          // SELECT ROWS
          // ----------------------------------- 

          vm.data = data;

          vm.tableParams3 = new ngTableParams({
              page: 1,            // show first page
              count: 10          // count per page
          }, {
              total: data.length, // length of data
              getData: function ($defer, params) {
                  // use build-in angular filter
                  var filteredData = params.filter() ?
                          $filter('filter')(data, params.filter()) :
                          data;
                  var orderedData = params.sorting() ?
                          $filter('orderBy')(filteredData, params.orderBy()) :
                          data;

                  params.total(orderedData.length); // set total for recalc pagination
                  $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              }
          });

          vm.changeSelection = function(user) {
            console.info(user);
          };

          // EXPORT CSV
          // -----------------------------------  

          var data4 = [{name: 'Moroni', age: 50},
              {name: 'Tiancum', age: 43},
              {name: 'Jacob', age: 27},
              {name: 'Nephi', age: 29},
              {name: 'Enos', age: 34},
              {name: 'Tiancum', age: 43},
              {name: 'Jacob', age: 27},
              {name: 'Nephi', age: 29},
              {name: 'Enos', age: 34},
              {name: 'Tiancum', age: 43},
              {name: 'Jacob', age: 27},
              {name: 'Nephi', age: 29},
              {name: 'Enos', age: 34},
              {name: 'Tiancum', age: 43},
              {name: 'Jacob', age: 27},
              {name: 'Nephi', age: 29},
              {name: 'Enos', age: 34}];

          vm.tableParams4 = new ngTableParams({
              page: 1,            // show first page
              count: 10           // count per page
          }, {
              total: data4.length, // length of data4
              getData: function($defer, params) {
                  $defer.resolve(data4.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              }
          });


          // SORTING
          // ----------------------------------- 



          vm.tableParams = new ngTableParams({
              page: 1,            // show first page
              count: 10,          // count per page
              sorting: {
                  name: 'asc'     // initial sorting
              }
          }, {
              total: data.length, // length of data
              getData: function($defer, params) {
                  // use build-in angular filter
                  var orderedData = params.sorting() ?
                          $filter('orderBy')(data, params.orderBy()) :
                          data;
          
                  $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              }
          });

          // FILTERS
          // ----------------------------------- 

          vm.tableParams2 = new ngTableParams({
              page: 1,            // show first page
              count: 10,          // count per page
              filter: {
                  name: '',
                  age: ''
                  // name: 'M'       // initial filter
              }
          }, {
              total: data.length, // length of data
              getData: function($defer, params) {
                  // use build-in angular filter
                  var orderedData = params.filter() ?
                         $filter('filter')(data, params.filter()) :
                         data;

                  vm.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                  params.total(orderedData.length); // set total for recalc pagination
                  $defer.resolve(vm.users);
              }
          });

          // AJAX
          
          var Api = $resource('server/table-data.json');

          vm.tableParams5 = new ngTableParams({
              page: 1,            // show first page
              count: 10           // count per page
          }, {
              total: 0,           // length of data
              counts: [],         // hide page counts control
              getData: function($defer, params) {
                  
                  // Service using cache to avoid mutiple requests
                  ngTableDataService.getData( $defer, params, Api);
                  
                  /* direct ajax request to api (perform result pagination on the server)
                  Api.get(params.url(), function(data) {
                      $timeout(function() {
                          // update table params
                          params.total(data.total);
                          // set new data
                          $defer.resolve(data.result);
                      }, 500);
                  });
                  */
              }
          });
        }
    }
})();



/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.tables')
        .controller('TablexEditableController', TablexEditableController);

    TablexEditableController.$inject = ['$filter', '$http', 'editableOptions', 'editableThemes','$q'];
    function TablexEditableController($filter, $http, editableOptions, editableThemes, $q) {
        var vm = this;

        activate();

        ////////////////

        function activate() {

          // editable row
          // ----------------------------------- 
          vm.users = [
            {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
            {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
            {id: 3, name: 'awesome user3', status: 2, group: null}
          ];

          vm.statuses = [
            {value: 1, text: 'status1'},
            {value: 2, text: 'status2'},
            {value: 3, text: 'status3'},
            {value: 4, text: 'status4'}
          ];

          vm.groups = [];
          vm.loadGroups = function() {
            return vm.groups.length ? null : $http.get('server/xeditable-groups.json').success(function(data) {
              vm.groups = data;
            });
          };

          vm.showGroup = function(user) {
            if(user.group && vm.groups.length) {
              var selected = $filter('filter')(vm.groups, {id: user.group});
              return selected.length ? selected[0].text : 'Not set';
            } else {
              return user.groupName || 'Not set';
            }
          };

          vm.showStatus = function(user) {
            var selected = [];
            if(user.status) {
              selected = $filter('filter')(vm.statuses, {value: user.status});
            }
            return selected.length ? selected[0].text : 'Not set';
          };

          vm.checkName = function(data, id) {
            if (id === 2 && data !== 'awesome') {
              return 'Username 2 should be `awesome`';
            }
          };

          vm.saveUser = function(data, id) {
            //vm.user not updated yet
            angular.extend(data, {id: id});
            console.log('Saving user: ' + id);
            // return $http.post('/saveUser', data);
          };

          // remove user
          vm.removeUser = function(index) {
            vm.users.splice(index, 1);
          };

          // add user
          vm.addUser = function() {
            vm.inserted = {
              id: vm.users.length+1,
              name: '',
              status: null,
              group: null,
              isNew: true
            };
            vm.users.push(vm.inserted);
          };

          // editable column
          // ----------------------------------- 


          vm.saveColumn = function(column) {
            var results = [];
            angular.forEach(vm.users, function(/*user*/) {
              // results.push($http.post('/saveColumn', {column: column, value: user[column], id: user.id}));
              console.log('Saving column: ' + column);
            });
            return $q.all(results);
          };

          // editable table
          // ----------------------------------- 

          // filter users to show
          vm.filterUser = function(user) {
            return user.isDeleted !== true;
          };

          // mark user as deleted
          vm.deleteUser = function(id) {
            var filtered = $filter('filter')(vm.users, {id: id});
            if (filtered.length) {
              filtered[0].isDeleted = true;
            }
          };

          // cancel all changes
          vm.cancel = function() {
            for (var i = vm.users.length; i--;) {
              var user = vm.users[i];
              // undelete
              if (user.isDeleted) {
                delete user.isDeleted;
              }
              // remove new 
              if (user.isNew) {
                vm.users.splice(i, 1);
              }
            }
          };

          // save edits
          vm.saveTable = function() {
            var results = [];
            for (var i = vm.users.length; i--;) {
              var user = vm.users[i];
              // actually delete user
              if (user.isDeleted) {
                vm.users.splice(i, 1);
              }
              // mark as not new 
              if (user.isNew) {
                user.isNew = false;
              }

              // send on server
              // results.push($http.post('/saveUser', user));
              console.log('Saving Table...');
            }

            return $q.all(results);
          };

        }
    }
})();

/**=========================================================
 * Module: UIGridController
  =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.tables')
        .controller('UIGridController', UIGridController);

    UIGridController.$inject = ['uiGridConstants', '$http'];
    function UIGridController(uiGridConstants, $http) {
        var vm = this;

        activate();

        ////////////////

        function activate() {

          // Basic example
          // ----------------------------------- 

          vm.gridOptions = {
            rowHeight: 34,
            data: [
              {
                  'name': 'Wilder Gonzales',
                  'gender': 'male',
                  'company': 'Geekko'
              },
              {
                  'name': 'Georgina Schultz',
                  'gender': 'female',
                  'company': 'Suretech'
              },
              {
                  'name': 'Carroll Buchanan',
                  'gender': 'male',
                  'company': 'Ecosys'
              },
              {
                  'name': 'Valarie Atkinson',
                  'gender': 'female',
                  'company': 'Hopeli'
              },
              {
                  'name': 'Schroeder Mathews',
                  'gender': 'male',
                  'company': 'Polarium'
              },
              {
                  'name': 'Ethel Price',
                  'gender': 'female',
                  'company': 'Enersol'
              },
              {
                  'name': 'Claudine Neal',
                  'gender': 'female',
                  'company': 'Sealoud'
              },
              {
                  'name': 'Beryl Rice',
                  'gender': 'female',
                  'company': 'Velity'
              },
              {
                  'name': 'Lynda Mendoza',
                  'gender': 'female',
                  'company': 'Dogspa'
              },
              {
                  'name': 'Sarah Massey',
                  'gender': 'female',
                  'company': 'Bisba'
              },
              {
                  'name': 'Robles Boyle',
                  'gender': 'male',
                  'company': 'Comtract'
              },
              {
                  'name': 'Evans Hickman',
                  'gender': 'male',
                  'company': 'Parleynet'
              },
              {
                  'name': 'Dawson Barber',
                  'gender': 'male',
                  'company': 'Dymi'
              },
              {
                  'name': 'Bruce Strong',
                  'gender': 'male',
                  'company': 'Xyqag'
              },
              {
                  'name': 'Nellie Whitfield',
                  'gender': 'female',
                  'company': 'Exospace'
              },
              {
                  'name': 'Jackson Macias',
                  'gender': 'male',
                  'company': 'Aquamate'
              },
              {
                  'name': 'Pena Pena',
                  'gender': 'male',
                  'company': 'Quarx'
              },
              {
                  'name': 'Lelia Gates',
                  'gender': 'female',
                  'company': 'Proxsoft'
              },
              {
                  'name': 'Letitia Vasquez',
                  'gender': 'female',
                  'company': 'Slumberia'
              },
              {
                  'name': 'Trevino Moreno',
                  'gender': 'male',
                  'company': 'Conjurica'
              }
            ]
          };
          
          // Complex example
          // ----------------------------------- 

          var data = [];
           
          vm.gridOptionsComplex = {
              showGridFooter: true,
              showColumnFooter: true,
              enableFiltering: true,
              columnDefs: [
                  { field: 'name', width: '13%' },
                  { field: 'address.street',aggregationType: uiGridConstants.aggregationTypes.sum, width: '13%' },
                  { field: 'age', aggregationType: uiGridConstants.aggregationTypes.avg, aggregationHideLabel: true, width: '13%' },
                  { name: 'ageMin', field: 'age', aggregationType: uiGridConstants.aggregationTypes.min, width: '13%', displayName: 'Age for min' },
                  { name: 'ageMax', field: 'age', aggregationType: uiGridConstants.aggregationTypes.max, width: '13%', displayName: 'Age for max' },
                  { name: 'customCellTemplate', 
                    field: 'age', 
                    width: '14%', 
                    footerCellTemplate: '<div class="ui-grid-cell-contents bg-info text-center">Custom HTML</div>' 
                  },
                  { name: 'registered', field: 'registered', width: '20%', cellFilter: 'date', footerCellFilter: 'date', aggregationType: uiGridConstants.aggregationTypes.max }
              ],
              data: data,
              onRegisterApi: function(gridApi) {
                vm.gridApi = gridApi;
              }
          };
           
          $http.get('server/uigrid-complex.json')
            .success(function(data) {
              data.forEach( function(row) {
                row.registered = Date.parse(row.registered);
              });
              vm.gridOptionsComplex.data = data;
            });


           vm.gridOptions1 = {
              paginationPageSizes: [25, 50, 75],
              paginationPageSize: 25,
              columnDefs: [
                { name: 'name' },
                { name: 'gender' },
                { name: 'company' }
              ]
            };
           
            $http.get('server/uigrid-100.json')
            .success(function (data) {
              vm.gridOptions1.data = data;
            });

        }
    }
})();

(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name tandemWebApp.controller:ModalConfigureTagctrl
   * @description
   * # ModalPlayTagctrl
   * Controller of the tandemWebApp
   */
  angular.module('app.tags').controller('EditTagModalController', [
    '$scope',
    'Notify',
    'Tag',
    'Question',
    'session',
    'fileUtils',
    'editableOptions',
    'editableThemes',
    'APP_CONFIG',
    'editingTag',
     function (
     $scope,
     Notify,
     Tag,
     Question,
     session,
     fileUtils,
     editableOptions,
     editableThemes,
     APP_CONFIG,
     editingTag) {
      var vm = this;

      editableOptions.theme = 'bs3';
      editableThemes.bs3.inputClass = 'tags-input';
      editableThemes.bs3.buttonsClass = 'btn-xs';
      editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-success">' +
        '<span class="fa fa-check"></span></button>';
      editableThemes.bs3.cancelTpl = '<button type="button" class="btn btn-default" ' +
        'ng-click="$form.$cancel()">'+
        '<span class="fa fa-times text-muted"></span>'+
        '</button>';

      vm.maxResults = 99999;
      vm.searchParams = null;
      vm.availableQuestions = [];
      vm.newQuestion = {};
      vm.selected = [];
      vm.addedSelected = [];
      vm.tag = editingTag;
      vm.tag.questions = (vm.tag.questions) ? vm.tag.questions : []; 
    
      // get associated questions first
      var tagParams = {
        tags: vm.tag._id 
      }
      var params = {
        "where": JSON.stringify(tagParams),
        "max_results": 999999
      };
      Question.getList(params).then(function (addedQuestions) {
        vm.tag.questionIds = _.pluck(addedQuestions, '_id'); 
        vm.tag.questions = addedQuestions;
        var where = {
          "tags": { "$ne": vm.tag._id } 
        };
        var params = {
          "where": JSON.stringify(where),
          "max_results": vm.maxResults
        };
        Question.getList(params).then(function (questions) {
          vm.totalAvailable = questions._meta.total;
          vm.availableQuestions = questions;
        });
      });

      vm.search = function (added) {
        var speaksFilter = {};
        var learningFilter = {};
        var searchText = (added) ? vm.addedSearchText : vm.searchText;
        var tagsFilter = {
          "tags_index": {
            "$regex": ".*" + searchText + ".*",
            "$options": "i"
          }
        };
        speaksFilter['text.translations.' + session.speaks] = {
          "$regex": ".*" + searchText + ".*",
          "$options": "i"
        };
        learningFilter['text.translations.' + session.learning] = {
          "$regex": ".*" + searchText + ".*",
          "$options": "i"
        };

        if (added) {
          var filter = {
            "$and": [
              { "tags": vm.tag._id },
              { "$or": [ speaksFilter, learningFilter, tagsFilter ] }
            ]
          };
          var params = {
            "where": JSON.stringify(filter),
            "max_results": vm.maxResults
          };
          vm.addedSearchParams = params;
          vm.tag.questions = [];
          Question.getList(params).then(function (questions) {
            vm.addedTotalAvailable = questions._meta.total;
            vm.tag.questions = questions;
          });
        } else {
          var filter = {
            "$and": [
              { "tags": { "$ne": vm.tag._id } },
              { "$or": [ speaksFilter, learningFilter, tagsFilter ] }
            ]
          };
          var params = {
            "where": JSON.stringify(filter),
            "max_results": vm.maxResults
          };
          vm.searchParams = params;
          vm.availableQuestions = [];
          Question.getList(params).then(function (questions) {
            vm.totalAvailable = questions._meta.total;
            vm.availableQuestions = questions;
          });
        }
      };

      vm.clearNewQuestion = function() {
        vm.newQuestion.speaksText = 'Click here to enter ' + session.speaksText;
        vm.newQuestion.learningText = 'Click here to enter ' + session.learningText;
      };

      /**
       * Submit a new question to the server api using
       * the Question service
       */  
      vm.saveQuestion = function () {
        var translations = {};
        translations[session.speaks] = vm.newQuestion.speaksText;
        translations[session.learning] = vm.newQuestion.learningText;
        var questionData = {
          text: {
            languages: 2,
            original_language: session.speaks,
            translations: translations
          },
          status: 'submitted',
          tags: [ vm.tag._id ],
          submitted_by: session.userId
        };

        // add the new question first
        Question.post(questionData).then(function (question) {
          question.text = questionData.text;  
          Notify.alert("Question added.", {status: 'success'});
          vm.tag.questions.push(question);
          vm.tag.questionIds.push(question._id);
        }, function (response) {
          Notify.alert("Server Problem", {status: 'danger'});
        });

      };

      vm.addQuestion = function (question) {
        if (question.tags) {
          question.tags.push(vm.tag._id);
        } else {
          question.tags = [vm.tag._id];
        }
        // save new question id to practice_set
        Question.one(question._id).patch({tags: question.tags }).then(function () {

          Notify.alert("Added to Tag", {status: 'success'});
          vm.tag.questions.push(question);
          vm.tag.questionIds.push(question._id);
          vm.availableQuestions = vm.availableQuestions.filter(function (q) {
            return q._id !== question._id;
          });

        }, function () {
          Notify.alert("Failed to add to Tag", {status: 'danger'});
        });
      };

      vm.addAllSelected = function () {
        angular.forEach(vm.availableQuestions, function (question) {
          if (vm.selected.indexOf(question._id) > -1) {
            vm.addQuestion(question);
          }
        });
        // Reset the search, otherwise paging gets weird
        vm.search();
      };

      vm.removeAllSelected = function () {
        angular.forEach(vm.tag.questions, function (question) {
          if (vm.selected.indexOf(question._id) > -1) {
            vm.removeQuestion(question);
          }
        });
        // Reset the search, otherwise paging gets weird
        vm.search();
      };

      vm.removeQuestion = function (question) {
        question.tags = _.without(question.tags, vm.tag._id);
        // save new question id to practice_set
        Question.one(question._id).patch({tags: question.tags}).then(function () {
          Notify.alert("Added to Tag", {status: 'success'});
          vm.availableQuestions.push(question);
          vm.tag.questionIds = _.without(vm.tag.questionIds, question._id);
          vm.tag.questions = vm.tag.questions.filter(function (q) {
            return q._id !== question._id;
          });
        }, function () {
          Notify.alert("Failed to add to Tag", {status: 'danger'});
        });
      };

      vm.toggleAll = function () {
        if (vm.allSelected) {
          vm.selected = [];
          vm.allSelected = false;
        } else {
          vm.selected = _.pluck(vm.availableQuestions, '_id');
          vm.allSelected = true;
        }  
      };

      vm.addedToggleAll = function () {
        if (vm.addedAllSelected) {
          vm.addedSelected = [];
          vm.addedAllSelected = false;
        } else {
          vm.addedSelected = _.pluck(vm.tags.questions, '_id');
          vm.addedAllSelected = true;
        }  
      };

      vm.toggleSelected = function (questionId) {
        var idx = vm.selected.indexOf(questionId);
        if (idx > -1) {
          vm.selected.splice(idx, 1);
        } else {
          vm.selected.push(questionId);
        } 
      };

      vm.addedToggleSelected = function (questionId) {
        var idx = vm.addedSelected.indexOf(questionId);
        if (idx > -1) {
          vm.addedSelected.splice(idx, 1);
        } else {
          vm.addedSelected.push(questionId);
        } 
      };

      vm.clearQuestions = function () {
        console.log('clear', vm.selected);
        // TODO: I think I will have to loop through all questions and remove the 
        // association, which is a bit inefficient, but not sure how else to 
        // do it
      };

      vm.saveTag = function () {
        var tagData = {
          text: vm.tag.text
        }
        Tag.one(vm.tag._id).patch(tagData).then(function() {
          Notify.alert("Tag updated.", {status: 'success'});
        }, function () {
          Notify.alert( "Server Problem.", {status: 'success'});
        });
      };

      vm.handleFileSelect = function (evt) {
        // using lastChild here because we are expecting
        // this from a directive, otherwise we would use
        // evt.currentTarget
        var file=evt.currentTarget.lastChild.files[0];

        // upload it
        vm.tag.updateImage(file).then(function (tag) {
          vm.tag = tag;
        }, function (response) {
          console.log('error updating tag image', response);
        });
      };

    } // end activate
  ]);
})();

(function() {
    'use strict';

    angular.module('app.tags')
      .controller('TagsController', [
      '$scope',
      '$q',
      'RouteHelpers',
      'APP_CONFIG',
      'Tag',
      'session',
      '$uibModal',
      'ngDialog',
      'Notify',
      function ProfileViewController(
        $scope,
        $q,
        helper,
        APP_CONFIG,
        Tag,
        session,
        $uibModal,
        ngDialog,
        Notify) {
          var vm = this;

          activate();

          ////////////////

          function activate() {

            vm.page = 1;
            vm.maxResults = 25;
            vm.session = session;

            // load first page of tags
            Tag.getList({max_results: vm.maxResults, page: vm.page}).then(function (tags) {
              vm.tags = tags;
            });

            // can be called with infinite load
            vm.loadMoreTags = function () {
              if (vm.page !== 'end') {
                var params = {};
                if (vm.searchParams) {
                  params = searchParams;
                }
                params.max_results = vm.maxResults;
                params.page = (vm.page + 1);
                Tag.getList(params).then(function (tags) {
                  if (tags) {
                    vm.page++
                    tags.forEach(function (tag) {
                      vm.tags.add(tag);
                    });
                  } else {
                    vm.page = 'end';
                  }
                });
              } 
            };

            vm.editTag= function (tag) {
              var modalInstance = $uibModal.open({
                templateUrl: 'app/views/modals/edit-tag.html',
                controller: 'EditTagModalController',
                controllerAs: 'editTag',
                resolve: angular.extend(helper.resolveFor('xeditable'),{
                  editingTag: function () {
                    return tag;
                  }
                }),
                size: 'lg'
              });

              var state = $('#modal-state');
              modalInstance.result.then(function () {
                console.log('dismissed with OK');
                // update tag in tag list
                vm.tags = vm.tags.filter(function (t) {
                  return t._id !== tag._id;
                });
                vm.tags.push(tag);
              }, function () {
                console.log('dismissed with Cancel');
              });  
            };

            vm.openImageSelectModal = function (tag) {
              var modalInstance = $uibModal.open({
                templateUrl: 'app/views/modals/image-select.html',
                controller: 'ImageSelectModalController',
                controllerAs: 'imageSelect',
                resolve: {
                  referenceObject: function () {
                    return tag;
                  }
                },
                size: 'lg'
              });

              var state = $('#modal-state');
              modalInstance.result.then(function () {
                console.log('dismissed with OK');
                // update question in questions list
              }, function () {
                console.log('dismissed with Cancel');
              });  
            };

            vm.clearNewTag = function () {
              vm.newTag.speaksText = 'Click here to enter ' + session.speaksText;
              vm.newTag.learningText = 'Click here to enter ' + session.learningText;
            };

            vm.openCreateTagModal = function (question) {
              vm.newTag = {};
              $scope.newTag = vm.newTag;
              ngDialog.openConfirm({
                template: 'app/views/modals/create-tag.html',
                className: 'ngdialog-theme-default',
                scope: $scope 
              }).then(function (value) {
                vm.createTag();
              }, function (reason) {
                console.log('cancelled create', reason);
              });
            };


            vm.createTag = function () {
              var text = {};
              text[session.speaks] = vm.newTag.speaksText;
              text[session.learning] = vm.newTag.learningText;
              var newTag = {
                text: {
                  languages: APP_CONFIG.languages.length,
                  original_language: session.speaks,
                  translations: text 
                },
                submitted_by: session.userId,
                status: 'submitted'
              };

              Tag.post(newTag).then(function (tag) {
                _.extend(tag, newTag);
                // add to the sets list
                vm.tags.add(tag);
                vm.clearNewTag();
                Notify.alert('Tag added.', {status: 'success'});
              }, function (response) {
                Notify.alert('There was a problem adding your tag.', {status: 'error'});
              });
            };

          } // activate END
        }
    ]);
})();

(function() {
    'use strict';

    angular
        .module('app.translate')
        .config(translateConfig)
        ;
    translateConfig.$inject = ['$translateProvider'];
    function translateConfig($translateProvider){

      $translateProvider.useStaticFilesLoader({
          prefix : 'app/i18n/',
          suffix : '.json'
      });

      $translateProvider.preferredLanguage('en');
      $translateProvider.useLocalStorage();
      $translateProvider.usePostCompiling(true);
      $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

    }
})();
(function() {
    'use strict';

    angular
        .module('app.translate')
        .run(translateRun)
        ;
    translateRun.$inject = ['$rootScope', '$translate'];
    
    function translateRun($rootScope, $translate){

      // Internationalization
      // ----------------------

      $rootScope.language = {
        // Handles language dropdown
        listIsOpen: false,
        // list of available languages
        available: {
          'en': 'English',
          'es_AR': 'Español',
          'de': 'Deutsch'
        },
        // display always the current ui language
        init: function () {
          var proposedLanguage = $translate.proposedLanguage() || $translate.use();
          var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
          var selectedCode = (proposedLanguage || preferredLanguage);
          $rootScope.language.selected = $rootScope.language.available[selectedCode];
          // save a reference for the current language code, and always use 2 char
          $rootScope.language.selectedCode = selectedCode.substring(0,2);
        },
        set: function (localeId) {
          // Set the new idiom
          $translate.use(localeId);
          // save a reference for the current language
          $rootScope.language.selected = $rootScope.language.available[localeId];
          // save a reference for the current language code, and always use 2 char
          $rootScope.language.selectedCode = localeId.substring(0,2);
          // finally toggle dropdown
          $rootScope.language.listIsOpen = ! $rootScope.language.listIsOpen;
        }
      };

      $rootScope.language.init();

    }
})();

/**=========================================================
 * Module: animate-enabled.js
 * Enable or disables ngAnimate for element with directive
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('animateEnabled', animateEnabled);

    animateEnabled.$inject = ['$animate'];
    function animateEnabled ($animate) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
          scope.$watch(function () {
            return scope.$eval(attrs.animateEnabled, scope);
          }, function (newValue) {
            $animate.enabled(!!newValue, element);
          });
        }
    }

})();

/**=========================================================
 * Module: browser.js
 * Browser detection
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .service('Browser', Browser);

    Browser.$inject = ['$window'];
    function Browser($window) {
      return $window.jQBrowser;
    }

})();

/**=========================================================
 * Module: clear-storage.js
 * Removes a key from the browser storage via element click
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('resetKey', resetKey);

    resetKey.$inject = ['$state', '$localStorage'];
    function resetKey ($state, $localStorage) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
              resetKey: '@'
            }
        };
        return directive;

        function link(scope, element) {
          element.on('click', function (e) {
              e.preventDefault();

              if(scope.resetKey) {
                delete $localStorage[scope.resetKey];
                $state.go($state.current, {}, {reload: true});
              }
              else {
                $.error('No storage key specified for reset.');
              }
          });
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('fileOnChange', function() {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                  var onChangeHandler = scope.$eval(attrs.fileOnChange);
                  element.bind('change', onChangeHandler);
                }
            };
        });
})();

(function() {

  'use strict'

  angular.module('app.utils').service('fileUtils', [

    function fileUtils() {
      var self = this;

      self.base64toBlob = function (dataURI) {
        // make base64 string into a file
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
          byteString = atob(dataURI.split(',')[1]);
        } else {
          byteString = unescape(dataURI.split(',')[1]);
        }

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
      }
    }

  ]);

})();

/**=========================================================
 * Module: fullscreen.js
 * Toggle the fullscreen mode on/off
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('toggleFullscreen', toggleFullscreen);

    toggleFullscreen.$inject = ['Browser'];
    function toggleFullscreen (Browser) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          // Not supported under IE
          if( Browser.msie ) {
            element.addClass('hide');
          }
          else {
            element.on('click', function (e) {
                e.preventDefault();

                if (screenfull.enabled) {
                  
                  screenfull.toggle();
                  
                  // Switch icon indicator
                  if(screenfull.isFullscreen)
                    $(this).children('em').removeClass('fa-expand').addClass('fa-compress');
                  else
                    $(this).children('em').removeClass('fa-compress').addClass('fa-expand');

                } else {
                  $.error('Fullscreen not enabled');
                }

            });
          }
        }
    }


})();

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
                  "<input id='file-input' style='display: none' file-on-change='{{ fileOnChange }}' type='file' filestyle=''>"
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

/**=========================================================
 * Module: load-css.js
 * Request and load into the current page a css file
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('loadCss', loadCss);

    function loadCss () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
          element.on('click', function (e) {
              if(element.is('a')) e.preventDefault();
              var uri = attrs.loadCss,
                  link;

              if(uri) {
                link = createLink(uri);
                if ( !link ) {
                  $.error('Error creating stylesheet link element.');
                }
              }
              else {
                $.error('No stylesheet location defined.');
              }

          });
        }
        
        function createLink(uri) {
          var linkId = 'autoloaded-stylesheet',
              oldLink = $('#'+linkId).attr('id', linkId + '-old');

          $('head').append($('<link/>').attr({
            'id':   linkId,
            'rel':  'stylesheet',
            'href': uri
          }));

          if( oldLink.length ) {
            oldLink.remove();
          }

          return $('#'+linkId);
        }
    }

})();

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

/**=========================================================
 * Module: now.js
 * Provides a simple way to display the current time formatted
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('now', now);

    now.$inject = ['dateFilter', '$interval'];
    function now (dateFilter, $interval) {
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attrs) {
          var format = attrs.format;

          function updateTime() {
            var dt = dateFilter(new Date(), format);
            element.text(dt);
          }

          updateTime();
          var intervalPromise = $interval(updateTime, 1000);

          scope.$on('$destroy', function(){
            $interval.cancel(intervalPromise);
          });

        }
    }

})();

/**=========================================================
 * Module: table-checkall.js
 * Tables check all checkbox
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('checkAll', checkAll);

    function checkAll () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          element.on('change', function() {
            var $this = $(this),
                index= $this.index() + 1,
                checkbox = $this.find('input[type="checkbox"]'),
                table = $this.parents('table');
            // Make sure to affect only the correct checkbox column
            table.find('tbody > tr > td:nth-child('+index+') input[type="checkbox"]')
              .prop('checked', checkbox[0].checked);

          });
        }
    }

})();

(function() {
    'use strict';

    angular.module('app.utils').controller('TranslateTextController', [
      '$sce',
      '$scope',
      '$rootScope',
      'session',
      'APP_CONFIG',
      'Notify',
      'mymemory',
      'duolingo',
      'googleSearch',
      function TranslateTextController(
          $sce,
          $scope,
          $rootScope,
          session,
          APP_CONFIG,
          Notify,
          mymemory,
          duolingo,
          googleSearch) {
            var self = this;

            activate();

            ////////////////

            function activate() {
              self.session = session;
              self.model = (self.initialText) ? self.initialText: 'click to enter content';
              self.popoverContent = null;
              self.originalWords = [];
              self.editMode = false;
              self.hasMatches = false;
              self.showHints = false;
              self.mmMatches = false;
              self.dlMatches = false;
              self.gsMatches = false;
              // account from a to without a from, and
              // vice-versa
              if (self.to && !self.from) {
                self.from = (self.to === session.speaks) ? session.learning : session.speaks;
              }
              if (self.from && !self.to) {
                self.to = (self.from === session.speaks) ? session.learning : session.speaks;
              }
              // default if no from and to were provided
              self.to = (self.to) ? self.to : session.speaks;
              self.from = (self.from) ? self.from : session.learning;
   
              // watch our bind var for possible changes from another 
              // translate directive
              if (self.send) {
                $scope.$watch(angular.bind(self, function() {
                  return self.model;
                }), function(newVal, oldVal) {
                  if (newVal) {
                    // if we get an update to our model, our
                    // translations are no longer valid, so
                    // just get rid of them
                    self.showHints = false;
                    self.mmMatches = false;
                  }
                });
              }
              
              self.clearMatches = function () {
                self.hasMatches = false;
                self.mmMatches = false;
                self.dlMatches = false;
                self.gsMatches = false;
              };

              // called from directive
              self.useTranslation = function (text) {
                self.setTranslation(text, false);
                self.clearMatches();
              };

              // sets the main accepted translation  
              self.setTranslation = function (text, fromWatch) {
                self.translation = text;
                if (self.send && !fromWatch) {
                  self.modelTranslation = text;
                  //self.clearMatches();
                  self.showHints = true;
                  self.editMode = false;
                } else {
                  // if we aren't sending this anywhere, assume user
                  // wants to use it in the current input
                  self.model = text;
                  self.initiText = text;
                  self.showHints = false;
                  self.editMode = false;
                } 
              };

              self.edit = function() {
                self.editMode = true;
              };

              self.setToSpeaks = function() {
                self.to = session.speaks;
                self.from = session.learning;
              };

              self.setToLearning = function() {
                self.to = session.learning;
                self.from = session.speaks;
              }


              self.translate = function() {
                // make an array of each word to build the popover hints
                // we need to add spaces between all words this way
                self.originalWords = self.model.split(" ");
    
                if ($rootScope.app.translation.mymemory) {
                  mymemory.translateText(self.model, self.from, self.to).then(function (mmMatches) {
                      if (mmMatches) {
                        self.hasMatches = true;
                        self.mmMatches = mmMatches;
                        self.setTranslation(mmMatches[0].translation, false);
                      }
                  });
                }
                // dont do duloingo lookup when we arent sending the translation
                // to another element 
                if ($rootScope.app.translation.duolingo && self.send) {
                  duolingo.getTextHints(self.model, self.from, self.to).then(function (dlMatches) {
                    if (dlMatches) {
                      self.hasMatches = true;
                      self.dlMatches = dlMatches;
                      self.showHints = true;
                    }
                  });
                }

                if ($rootScope.app.translation.googleSearch) {
                  googleSearch.getSearchResults(self.model).then(function (gsMatches) {
                    if (gsMatches) {
                      self.hasMatches = true;
                      self.gsMatches = gsMatches;
                    }
                  });
                }

                self.editMode = false;
              };

              self.cancel = function() {
                self.editMode = false;
              };

              self.giveHints = function (originalWord) {
                var trusted = {};
                var tpl = '';

                // strip puncuation, as dl will do this as well
                originalWord = originalWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

                angular.forEach(self.dlMatches[originalWord], function (match) {
                  tpl += '<p class="translate-hint">' + match + '</p>';
                });
                self.popoverContent = $sce.trustAsHtml(tpl);
              };

            } // end activate
        }
    ]);
})();

(function() {
    'use strict';

    angular.module('app.utils').directive('translateText', [
        '$compile',
        function ($compile) {
          return {
            templateUrl: 'app/views/translate-text.html',
            restrict: 'A',
            controller: 'TranslateTextController',
            controllerAs: 'translate',
            scope: {
                allowChange: '='
            },
            bindToController: {
                initialText: '@', // text displaed before first click
                from: '@', // langaugeCode ('en', 'de', etc)
                to: '@', // langaugeCode ('en', 'de', etc)
                model: '=', // model var to bind to
                // TODO: send shouldn't be needed here, but I can't figure out
                // how to detect if bind-translation was set in the directive
                // controller, I can only get the VALUE of it. HELP
                send: '=', // tells if we should send translation to bind-translation
                modelTranslation: '=' // model to bind translation to
            },
            link: function (scope, element, attr, controller) {
   
                var oldContent = element.contents();
                var newContent = null;
              
                // update bind value when input text is changed 
                $(element).find(':input').on('input', function(e){
                  controller.model = $(this).val();
                });

                // select all text when the input itself is clicked
                $(element).find(':input').on('click', function(e){
                   $(this).select();
                });

                // select all text when any part of the element is clicked
                $(element).on('click', function(e){
                   $(this).find(':input').select();
                });
            }
          } 
        }
    ]);
})();

/**=========================================================
 * Module: trigger-resize.js
 * Triggers a window resize event from any element
 =========================================================*/
(function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('triggerResize', triggerResize);

    triggerResize.$inject = ['$window', '$timeout'];
    function triggerResize ($window, $timeout) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
          element.on('click', function(){
            $timeout(function(){
              // all IE friendly dispatchEvent
              var evt = document.createEvent('UIEvents');
              evt.initUIEvent('resize', true, false, $window, 0);
              $window.dispatchEvent(evt);
              // modern dispatchEvent way
              // $window.dispatchEvent(new Event('resize'));
            });
          });
        }
    }

})();

/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.utils')
        .service('Utils', Utils);

    Utils.$inject = ['$window', 'APP_MEDIAQUERY'];
    function Utils($window, APP_MEDIAQUERY) {

        var $html = angular.element('html'),
            $win  = angular.element($window),
            $body = angular.element('body');

        return {
          // DETECTION
          support: {
            transition: (function() {
                    var transitionEnd = (function() {

                        var element = document.body || document.documentElement,
                            transEndEventNames = {
                                WebkitTransition: 'webkitTransitionEnd',
                                MozTransition: 'transitionend',
                                OTransition: 'oTransitionEnd otransitionend',
                                transition: 'transitionend'
                            }, name;

                        for (name in transEndEventNames) {
                            if (element.style[name] !== undefined) return transEndEventNames[name];
                        }
                    }());

                    return transitionEnd && { end: transitionEnd };
                })(),
            animation: (function() {

                var animationEnd = (function() {

                    var element = document.body || document.documentElement,
                        animEndEventNames = {
                            WebkitAnimation: 'webkitAnimationEnd',
                            MozAnimation: 'animationend',
                            OAnimation: 'oAnimationEnd oanimationend',
                            animation: 'animationend'
                        }, name;

                    for (name in animEndEventNames) {
                        if (element.style[name] !== undefined) return animEndEventNames[name];
                    }
                }());

                return animationEnd && { end: animationEnd };
            })(),
            requestAnimationFrame: window.requestAnimationFrame ||
                                   window.webkitRequestAnimationFrame ||
                                   window.mozRequestAnimationFrame ||
                                   window.msRequestAnimationFrame ||
                                   window.oRequestAnimationFrame ||
                                   function(callback){ window.setTimeout(callback, 1000/60); },
            /*jshint -W069*/
            touch: (
                ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
                (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
                (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
                (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
                false
            ),
            mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
          },
          // UTILITIES
          isInView: function(element, options) {
              /*jshint -W106*/
              var $element = $(element);

              if (!$element.is(':visible')) {
                  return false;
              }

              var window_left = $win.scrollLeft(),
                  window_top  = $win.scrollTop(),
                  offset      = $element.offset(),
                  left        = offset.left,
                  top         = offset.top;

              options = $.extend({topoffset:0, leftoffset:0}, options);

              if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                  left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
                return true;
              } else {
                return false;
              }
          },
          
          langdirection: $html.attr('dir') === 'rtl' ? 'right' : 'left',

          isTouch: function () {
            return $html.hasClass('touch');
          },

          isSidebarCollapsed: function () {
            return $body.hasClass('aside-collapsed');
          },

          isSidebarToggled: function () {
            return $body.hasClass('aside-toggled');
          },

          isMobile: function () {
            return $win.width() < APP_MEDIAQUERY.tablet;
          }

        };
    }
})();

(function() {
    'use strict';

    angular
        .module('custom', [
            // request the the entire framework
            'angle',
            // or just modules
            'app.core',
            'app.sidebar'
            /*...*/
        ]);
})();

// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('custom')
        .controller('Controller', Controller);

    Controller.$inject = ['$log'];
    function Controller($log) {
        // for controllerAs syntax
        // var vm = this;

        activate();

        ////////////////

        function activate() {
          $log.log('I\'m a line from custom.js');
        }
    }
})();

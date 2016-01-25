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

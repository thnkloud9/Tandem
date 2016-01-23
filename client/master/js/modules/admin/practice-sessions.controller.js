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
              {headerName: 'Practice Set', field: 'practice_set', width: 25},
              {headerName: 'Status', field: 'status', width: 25},
              {headerName: 'Created', field: '_created', width: 25},
              {headerName: 'Updated', field: '_updated', width: 25},
              {headerName: 'Submitted By', field: 'submitted_by', width: 25}
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
            self.practiceSessions = [];
            var params = {
              max_results: self.maxResults,
              page: self.page
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

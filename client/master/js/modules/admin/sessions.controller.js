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

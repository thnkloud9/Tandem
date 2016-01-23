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

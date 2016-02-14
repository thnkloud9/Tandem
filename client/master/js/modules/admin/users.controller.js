/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('UsersAdminController', [
      'Notify',
      'APP_CONFIG',
      'session',
      'User',
      function UsersAdminController(
        Notify,
        APP_CONFIG,
        session,
        User) {
          var self = this;

          activate();

          ////////////////

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 15},
              {
                headerName: 'Roles',
                field: 'roles',
                width: 25,
                valueGetter: function (params) {
                  return params.data.roles.join(", ");
                }
              },
              {headerName: 'FirstName', field: 'first_name', width: 25},
              {headerName: 'LastName', field: 'last_name', width: 25},
              {headerName: 'Username', field: 'username', width: 25},
              {headerName: 'City', field: 'city', width: 25},
              {headerName: 'Country', field: 'country', width: 25},
              {headerName: 'Speaks', field: 'speaks', width: 25},
              {headerName: 'Learning', field: 'learning', width: 25},
              {headerName: 'Points', field: 'points', width: 25},
              {headerName: 'Created', field: '_created', width: 25},
              {headerName: 'Last Login', field: 'last_login', width: 25},
              {
                headerName: 'Tools',
                field: '',
                width: 25,
                cellRenderer: function (params) {
                  return "<button ng-click='table.deleteUser(\"" + params.data._id + "\")' class='btn btn-xs btn-danger'>x</button>";
                }
              }
            ];

            // set table options 
            self.gridOptions = {
                columnDefs: columnDefs,
                rowData: null,
                enableSorting: true,
                enableFilter: true,
                enableColResize: true,
                angularCompileRows: true
            };

            // load data
            self.maxResults = 9999;
            self.users = [];
            var params = {
              max_results: self.maxResults
            };
            User.getList(params).then(function (users) {
              var fields = _.pluck(columnDefs, 'field');
              angular.forEach(users, function (user) {
                self.users.push(_.pick(user, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(self.users);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addUser = function () {
              self.users.push(angular.copy(self.editingUser));
            };

            self.editUser = function(index) {
              self.users.splice(index, 1, angular.copy(self.editingUser));
            };

            self.deleteUser = function(index) {
              User.one(id).remove(id).then(function (response) {
                Notify.alert("User deleted", {status: 'success'});
                self.users = _.reject(self.users, function(s) {
                  return s._id === id;
                });
                self.gridOptions.api.setRowData(self.users);
              }, function (response) {
                Notify.alert("There was a problem deleting User", {status: 'danger'});
              });
            };

          } // activate END
      }
    ]);
})();

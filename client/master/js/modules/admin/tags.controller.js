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

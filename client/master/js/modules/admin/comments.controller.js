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

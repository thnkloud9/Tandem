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

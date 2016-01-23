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

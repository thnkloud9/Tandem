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

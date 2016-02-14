/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('QuestionssAdminController', [
      'Notify',
      'APP_CONFIG',
      'session',
      'Question',
      function QuestionssAdminController(
        Notify,
        APP_CONFIG,
        session,
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
                headerName: 'tags',
                field: 'tags',
                width: 50,
                valueGetter: function (params) {
                  var out = '';
                  angular.forEach(params.data.tags, function (t) {
                    out += t.text.translations[session.speaks] + '<br>';
                  });
                  return out;
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
              {headerName: 'Updated', field: '_updated', width: 25, sort: 'asc'},
              {
                headerName: 'Tools',
                field: '',
                width: 25,
                cellRenderer: function (params) {
                    return "<button ng-click='table.deleteQuestion(\"" + params.data._id + "\")' class='btn btn-xs btn-danger'>x</button>";
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
              getRowHeight: function (params) {
                return params.data.rowHeight;
              },
              angularCompileRows: true
            };

            // load data
            self.maxResults = 9999;
            self.questions = [];
            var params = {
              embedded: {
                submitted_by: 1,
                tags: 1
              },
              "max_results": self.maxResults
            };
            Question.getList(params).then(function (questions) {
              var fields = _.pluck(columnDefs, 'field');
              fields.push('rowHeight');
              angular.forEach(questions, function (question) {
                if (question.tags) {
                  question.rowHeight = Math.floor(question.tags.length * 25);
                } else {
                  question.rowHeight = 25;
                }
                self.questions.push(_.pick(question, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(questions);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addQuestion = function () {
              self.questions.push(angular.copy(self.editingQuestion));
            };

            self.editQuestion = function(index) {
              self.questions.splice(index, 1, angular.copy(self.editingQuestion));
            };

            self.deleteQuestion = function(id) {
              Question.one(id).remove(id).then(function (response) {
                Notify.alert("Question deleted", {status: 'success'});
                self.questions = _.reject(self.questions, function(s) {
                  return s._id === id;
                });
                self.gridOptions.api.setRowData(self.questions);
              }, function (response) {
                Notify.alert("There was a problem deleting Question", {status: 'danger'});
              });
            };

          } // activate END
      }
    ]);
})();

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
          var vm = this;

          activate();

          ////////////////

          function updateQuestion(questionId, questionData) {
            Question.one(questionId).patch(questionData).then(function () {
              Notify.alert("Question updated.", {status: 'success'});
            }, function () {
              Notify.alert( "Server Problem.", {status: 'danger'});
            });
          };

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 20},
              {headerName: 'Category', field: 'category', width: 12},
              {
                headerName: 'en Text',
                field: 'text',
                width: 100,
                editable: true,
                newValueHandler: function (params) {
                  if (params.newValue !== params.data.text.translations.en) {
                    var questionData = { text: { translations: { en: params.newValue } } };
                    updateQuestion(params.data._id, questionData);
                    params.data.text.translations.en = params.newValue;
                  }
                },
                valueGetter: function (params) {
                  return params.data.text.translations.en;
                }
              },
              {
                headerName: 'de Text',
                field: 'text',
                width: 100,
                editable: true,
                newValueHandler: function (params) {
                  if (params.newValue !== params.data.text.translations.de) {
                    var questionData = { text: { translations: { de: params.newValue } } };
                    updateQuestion(params.data._id, questionData);
                    params.data.text.translations.de = params.newValue;
                  }
                },
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
                    var html = "<button ng-click='table.deleteQuestion(\"" + params.data._id + "\")' class='btn btn-xs btn-danger fa fa-times'></button>";
                    return html;
                }
              }
            ];

            // set table options 
            vm.gridOptions = {
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
            vm.maxResults = 9999;
            vm.questions = [];
            var params = {
              embedded: {
                submitted_by: 1,
                tags: 1
              },
              "max_results": vm.maxResults
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
                vm.questions.push(_.pick(question, fields));
              });
              // load table data
              vm.gridOptions.api.setRowData(questions);
              vm.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            vm.addQuestion = function () {
              vm.questions.push(angular.copy(vm.editingQuestion));
            };

            vm.editQuestion = function(id) {
            };

            vm.deleteQuestion = function(id) {
              Question.one(id).remove(id).then(function (response) {
                Notify.alert("Question deleted", {status: 'success'});
                vm.questions = _.reject(vm.questions, function(s) {
                  return s._id === id;
                });
                vm.gridOptions.api.setRowData(vm.questions);
              }, function (response) {
                Notify.alert("There was a problem deleting Question", {status: 'danger'});
              });
            };

          }; // activate END
      }
    ]);
})();

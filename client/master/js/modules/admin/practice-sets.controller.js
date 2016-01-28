/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('PracticeSetsAdminController', [
      'Notify',
      'APP_CONFIG',
      'session',
      'PracticeSet',
      function PracticeSetsAdminController(
        Notify,
        APP_CONFIG,
        session,
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
              {
                headerName: 'Description',
                field: 'description',
                width: 25,
                valueGetter: function (params) {
                  return params.data.description.translations.en; 
                }
              },
              {headerName: 'Score', field: 'score', width: 25},
              {headerName: 'Played', field: 'played', width: 25},
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
              },
              {
                headerName: 'Tools',
                field: '',
                width: 25,
                cellRenderer: function (params) {
                  return "<button ng-click='table.deletePracticeSet(\"" + params.data._id + "\")' class='btn btn-xs btn-danger'>x</button>";
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
                getRowHeight: function (params) {
                  return params.data.rowHeight;
                },
                angularCompileRows: true
            };

            // load data
            self.maxResults = 9999;
            self.practiceSets = [];
            var params = {
              embedded: {
                questions: 1,
                submitted_by: 1
              },
              max_results: self.maxResults
            };
            PracticeSet.getList(params).then(function (practiceSets) {
              var fields = _.pluck(columnDefs, 'field');
              fields.push('rowHeight');
              angular.forEach(practiceSets, function (practiceSet) {
                if (practiceSet.questions) {
                  var questionHeight = Math.floor(practiceSet.questions.length * 25);
                  practiceSet.rowHeight = Math.max(questionHeight, 25);
                } else {
                  practiceSet.rowHeight = 25; 
                }
                self.practiceSets.push(_.pick(practiceSet, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(self.practiceSets);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addPracticeSet = function () {
              self.practiceSets.push(angular.copy(self.editingPracticeSet));
            };

            self.editPracticeSet = function(index) {
              self.practiceSets.splice(index, 1, angular.copy(self.editingPracticeSet));
            };

            self.deletePracticeSet = function(index) {
              PracticeSet.one(id).remove(id).then(function (response) {
                Notify.alert("PracticeSet deleted", {status: 'success'});
                self.practiceSets = _.reject(self.practiceSets, function(s) {
                  return s._id === id;
                });
                self.gridOptions.api.setRowData(self.practiceSets);
              }, function (response) {
                Notify.alert("There was a problem deleting PracticeSet", {status: 'danger'});
              });
            };

          } // activate END
      }
    ]);
})();

/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('PracticeSessionsAdminController', [
      'PracticeSession',
      'Notify',
      'APP_CONFIG',
      'session',
      function PracticeSessionsAdminController(
        PracticeSession,
        Notify,
        APP_CONFIG,
        session) {
          var self = this;

          activate();

          ////////////////

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 15},
              {
                headerName: 'Questions',
                field: 'questions',
                width: 45,
                valueGetter: function (params) {
                  var out = '';
                  angular.forEach(params.data.questions, function (q) {
                    out += q.text.translations[session.speaks] + '<br>';
                  });
                  return out;
                }
              },
              {
                headerName: 'Answers',
                field: 'answers',
                width: 45,
                valueGetter: function (params) {
                  var out = '';
                  angular.forEach(params.data.answers, function (a) {
                    out += a.text.translations[session.speaks] + '<br>';
                  });
                  return out;
                }
              },
              {
                headerName: 'Audio',
                field: 'audio',
                width: 25,
                valueGetter: function (params) {
                  var out = '';
                  angular.forEach(params.data.audio, function (a) {
                    out += '<a href="' + APP_CONFIG.API.rootURI + '/assets/audio/' + a + '" target="_blank">' + a + '</a><br>';
                  });
                  return out;
                }
              },
              {headerName: 'Platform', field: 'platform', width: 25},
              {
                headerName: 'Practice Set',
                field: 'practice_set',
                width: 35,
                valueGetter: function (params) {
                  return params.data.practice_set.title;
                }
              },
              {
                headerName: 'category',
                field: 'practice_set',
                width: 25,
                valueGetter: function (params) {
                  return params.data.practice_set.category;
                }
              },
              {headerName: 'Status', field: 'status', width: 25},
              {headerName: 'Created', field: '_created', width: 25},
              {headerName: 'Updated', field: '_updated', width: 25},
              {
                headerName: 'SubmittedBy',
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
                    return "<button ng-click='table.deletePracticeSession(\"" + params.data._id + "\")' class='btn btn-xs btn-danger'>x</button>";
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
            self.practiceSessions = [];
            var params = {
              embedded: {
                submitted_by: 1,
                practice_set: 1,
                questions: 1,
                answers: 1
              },
              max_results: self.maxResults
            };
            PracticeSession.getList(params).then(function (practiceSessions) {
              var fields = _.pluck(columnDefs, 'field');
              fields.push('rowHeight');
              angular.forEach(practiceSessions, function (practiceSession) {
                var questionHeight = Math.floor(practiceSession.questions.length * 25);
                var audioHeight = Math.floor(practiceSession.audio.length * 25);
                practiceSession.rowHeight = Math.max(questionHeight, audioHeight);
                self.practiceSessions.push(_.pick(practiceSession, fields));
              });
              self.practiceSessions = practiceSessions;
              // load table data
              self.gridOptions.api.setRowData(practiceSessions);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addPracticeSession = function () {
              self.practiceSessions.push(angular.copy(self.editingPracticeSession));
            };

            self.editPracticeSession = function(index) {
              self.practiceSessions.splice(index, 1, angular.copy(self.editingPracticeSession));
            };

            self.deletePracticeSession = function(id) {
              PracticeSession.one(id).remove(id).then(function (response) {
                Notify.alert("PracticeSession deleted", {status: 'success'});
                self.practiceSessions = _.reject(self.practiceSessions, function(s) {
                  return s._id === id;
                });
                self.gridOptions.api.setRowData(self.practiceSessions);
              }, function (response) {
                Notify.alert("There was a problem deleting PracticeSession", {status: 'danger'});
              });
            };

          } // activate END
      }
    ]);
})();

/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular.module('app.admin').controller('AudiosAdminController', [
      'Audio',
      function AudiosAdminController(
        Audio) {
          var self = this;

          activate();

          ////////////////

          function activate() {

            // define data, because datatables are strict
            var columnDefs = [
              {headerName: 'Id', field: '_id', width: 15},
              {headerName: 'context', field: 'context', width: 25},
              {headerName: 'languageCode', field: 'language_code', width: 25},
              {headerName: 'QuestionText', field: 'question_text', width: 25},
              {headerName: 'Audio', field: 'audio', width: 25},
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
            self.audios = [];
            var params = {
              max_results: self.maxResults,
              page: self.page
            };
            Audio.getList(params).then(function (audios) {
              var fields = _.pluck(columnDefs, 'field');
              angular.forEach(audios, function (audio) {
                self.audios.push(_.pick(audio, fields));
              });
              // load table data
              self.gridOptions.api.setRowData(audios);
              self.gridOptions.api.sizeColumnsToFit();
            });
            
            // funtions
            self.addAudio = function () {
              self.audios.push(angular.copy(self.editingAudio));
            };

            self.editAudio = function(index) {
              self.audios.splice(index, 1, angular.copy(self.editingAudio));
            };

            self.removePerson = function(index) {
              self.audios.splice(index, 1);
            };

          } // activate END
      }
    ]);
})();

(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name tandem.controller:AddQuestionAudioModalController
     * @description
     * # ModalAddQuestionCtrl
     * Controller of the tandemWebApp
     */
    angular.module('app.images').controller('ImageSelectModalController', [
      '$scope',
      'session',
      'googleSearch',
      'referenceObject',
       function ImageSelectModalController(
        $scope,
        session,
        googleSearch,
        referenceObject) {
        var self = this;

        self.session = session;
        self.searchText = '';
        self.searchResults = [];

        if (referenceObject.route === 'questions') {
          self.question = referenceObject;
          self.searchText = self.question.text.translations[session.learning];
          googleSearch.getImageResults(self.searchText).then(function (results) {
            self.searchResults = results;
            // get results in speaking language
            self.searchText = self.question.text.translations[session.speaks];
            googleSearch.getImageResults(self.searchText).then(function (extraResults) {
              self.searchResults.concat(extraResults);
            });
          }, function() {
            console.log('error with google search request');
          });
        }

        if (referenceObject.route === 'tags') {
          self.tag = referenceObject;
          self.searchText = self.tag.text.translations[session.learning];
          googleSearch.getImageResults(self.searchText).then(function (results) {
            self.searchResults = results;
            // get results in speaking language
            self.searchText = self.tag.text.translations[session.speaks];
            googleSearch.getImageResults(self.searchText).then(function (extraResults) {
              self.searchResults.concat(extraResults);
            });
          }, function() {
            console.log('error with google search request');
          });
        }

      }
    ]);
})();

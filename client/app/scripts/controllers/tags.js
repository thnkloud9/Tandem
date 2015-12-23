'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:TagsCtrl
 * @description
 * # TagsCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('TagsCtrl', [
  '$q',
  '$modal',
  '$aside',
  'toaster',
  'modalFactory',
  'config',
  'Tag',
  'session',
   function ($q, $modal, $aside, toaster, modalFactory, config, Tag, session) {
    var self = this;

    self.isAdmin = (session.roles === "admin");
    self.speaksCode = session.speaks;
    self.learningCode = session.learning;
    self.page = 1;
    self.maxResults = 15;

    Tag.getList({max_results: self.maxResults, page: self.page}).then(function (tags) {
      self.tags = tags; 
    });

    self.loadMoreTags = function () {
      if (self.page !== 'end') {
        var params = {};
        if (self.searchParams) {
          params = searchParams;
        }
        params.max_results = self.maxResults;
        params.page = (self.page + 1);
        Tag.getList(params).then(function (tags) {
          if (tags) {
            self.page++
            tags.forEach(function (tag) {
              self.tags.add(tag);
            });
          } else {
            self.page = 'end';
          }
        });
      } 
    }

    self.search = function () {
      var speaksFilter = {};
      var learningFilter = {};
      speaksFilter['text.translations.' + session.speaks] = {
        "$regex": ".*" + self.searchText + ".*",
        "$options": "i"
      };
      learningFilter['text.translations.' + session.learning] = {
        "$regex": ".*" + self.searchText + ".*",
        "$options": "i"
      };
      var filter = {
        "$or": [
          speaksFilter,
          learningFilter,
        ]
      };
      var params = {
        "where": JSON.stringify(filter)
      };

      self.searchParams = params;
      Tag.getList(params).then(function (tags) {
        self.page = 1;
        self.tags = tags;
      });
    };

    self.saveTag = function (tag) {
      var translations = {};
      translations[session.speaks] = tag.text.translations[self.speaksCode];
      translations[session.learning] = tag.text.translations[self.learningCode];
      var tagData = {
        text: {
          languages: 2,
          original_language: session.speaks,
          translations: translations
        },
      }
      Tag.one(tag._id).patch(tagData).then(function (tag) {
        toaster.pop('success', "Tag Updated", "Your tag has been updated.");
      }, function (response) {
        toaster.pop('error', "Server Problem", "There was a server problem.  Please try again in a few moments.");
      });
    };

    self.removeTag = function (tag) {
      var modal;
      var title = 'Do you really want to remove this Tag?';
      var text = 'It will be removed from all associated questions';

      modal = modalFactory.confirmLight(title, text);
      modal.result.then(function () {
        return Tag.one(tag._id).remove();
      }, $q.reject)
      .then(function () {
        toaster.pop('success', "Tag Removed", "Tag has been removed.");
      });
    };

    self.createTag = function () {
      var translations = {};
      translations[session.speaks] = self.newTag.speaksText;
      translations[session.learning] = self.newTag.learningText;
      var tagData = {
        text: {
          languages: 2,
          original_language: session.speaks,
          translations: translations
        },
        status: 'submitted',
        submitted_by: session.userId
      };
      Tag.post(tagData).then(function (tag) {
        self.tags.add(tag);
        toaster.pop('success', "Tag Added", "Thanks for contributing!  Your tag has been added.");
        self.newTag.speaksText = '';
        self.newTag.learningText = '';
      }, function (response) {
        toaster.pop('error', "Server Problem", "There was a server problem.  Please try again in a few moments.");
      });
    };
    
    self.showHelp = function () {
      var asideInstance = $aside.open({
        templateUrl: 'views/aside-tags-help.html',
        placement: 'left',
        size: 'sm'
      });
    };

  }
]);


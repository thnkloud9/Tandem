(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name tandemWebApp.controller:ModalConfigureTagctrl
   * @description
   * # ModalPlayTagctrl
   * Controller of the tandemWebApp
   */
  angular.module('app.tags').controller('EditTagModalController', [
    '$scope',
    'Notify',
    'Tag',
    'Question',
    'session',
    'fileUtils',
    'editableOptions',
    'editableThemes',
    'APP_CONFIG',
    'editingTag',
     function (
     $scope,
     Notify,
     Tag,
     Question,
     session,
     fileUtils,
     editableOptions,
     editableThemes,
     APP_CONFIG,
     editingTag) {
      var vm = this;

      editableOptions.theme = 'bs3';
      editableThemes.bs3.inputClass = 'tags-input';
      editableThemes.bs3.buttonsClass = 'btn-xs';
      editableThemes.bs3.submitTpl = '<button type="submit" class="btn btn-success">' +
        '<span class="fa fa-check"></span></button>';
      editableThemes.bs3.cancelTpl = '<button type="button" class="btn btn-default" ' +
        'ng-click="$form.$cancel()">'+
        '<span class="fa fa-times text-muted"></span>'+
        '</button>';

      vm.maxResults = 99999;
      vm.searchParams = null;
      vm.availableQuestions = [];
      vm.newQuestion = {};
      vm.selected = [];
      vm.addedSelected = [];
      vm.tag = editingTag;
      vm.tag.questions = (vm.tag.questions) ? vm.tag.questions : []; 
    
      // get associated questions first
      var tagParams = {
        tags: vm.tag._id 
      }
      var params = {
        "where": JSON.stringify(tagParams),
        "max_results": 999999
      };
      Question.getList(params).then(function (addedQuestions) {
        vm.tag.questionIds = _.pluck(addedQuestions, '_id'); 
        vm.tag.questions = addedQuestions;
        var where = {
          "tags": { "$ne": vm.tag._id } 
        };
        var params = {
          "where": JSON.stringify(where),
          "max_results": vm.maxResults
        };
        Question.getList(params).then(function (questions) {
          vm.totalAvailable = questions._meta.total;
          vm.availableQuestions = questions;
        });
      });

      vm.search = function (added) {
        var searchText = (added) ? vm.addedSearchText : vm.searchText;
        var filter = (added) ?  { "tags": vm.tag._id } : { "tags": { "$ne": vm.tag._id } };
       
        vm.tag.questions = [];
        Question.searchByText(searchText, filter, { "max_results": vm.maxResults })
          .then(function (results) {
          if (added) {
            vm.addedTotalAvailable = results.questions._meta.total;
            vm.tag.questions = results.questions;
          } else {
            vm.totalAvailable = results.questions._meta.total;
            vm.availableQuestions = results.questions;
          }
        }); 
      };

      vm.clearNewQuestion = function() {
        vm.newQuestion.speaksText = 'Click here to enter ' + session.speaksText;
        vm.newQuestion.learningText = 'Click here to enter ' + session.learningText;
      };

      /**
       * Submit a new question to the server api using
       * the Question service
       */  
      vm.saveQuestion = function () {
        var translations = {};
        translations[session.speaks] = vm.newQuestion.speaksText;
        translations[session.learning] = vm.newQuestion.learningText;
        var questionData = {
          text: {
            languages: 2,
            original_language: session.speaks,
            translations: translations
          },
          // TODO: add category here
          status: 'submitted',
          tags: [ vm.tag._id ],
          submitted_by: session.userId
        };

        // add the new question first
        Question.post(questionData).then(function (question) {
          question.text = questionData.text;  
          Notify.alert("Question added.", {status: 'success'});
          vm.tag.questions.push(question);
          vm.tag.questionIds.push(question._id);
        }, function (response) {
          Notify.alert("Server Problem", {status: 'danger'});
        });

      };

      vm.addQuestion = function (question) {
        if (question.tags) {
          question.tags.push(vm.tag._id);
        } else {
          question.tags = [vm.tag._id];
        }
        // save new question id to practice_set
        Question.one(question._id).patch({tags: question.tags }).then(function () {

          Notify.alert("Added to Tag", {status: 'success'});
          vm.tag.questions.push(question);
          vm.tag.questionIds.push(question._id);
          vm.availableQuestions = vm.availableQuestions.filter(function (q) {
            return q._id !== question._id;
          });

        }, function () {
          Notify.alert("Failed to add to Tag", {status: 'danger'});
        });
      };

      vm.addAllSelected = function () {
        angular.forEach(vm.availableQuestions, function (question) {
          if (vm.selected.indexOf(question._id) > -1) {
            vm.addQuestion(question);
          }
        });
        // Reset the search, otherwise paging gets weird
        vm.search();
      };

      vm.removeAllSelected = function () {
        angular.forEach(vm.tag.questions, function (question) {
          if (vm.selected.indexOf(question._id) > -1) {
            vm.removeQuestion(question);
          }
        });
        // Reset the search, otherwise paging gets weird
        vm.search();
      };

      vm.removeQuestion = function (question) {
        question.tags = _.without(question.tags, vm.tag._id);
        // save new question id to practice_set
        Question.one(question._id).patch({tags: question.tags}).then(function () {
          Notify.alert("Added to Tag", {status: 'success'});
          vm.availableQuestions.push(question);
          vm.tag.questionIds = _.without(vm.tag.questionIds, question._id);
          vm.tag.questions = vm.tag.questions.filter(function (q) {
            return q._id !== question._id;
          });
        }, function () {
          Notify.alert("Failed to add to Tag", {status: 'danger'});
        });
      };

      vm.toggleAll = function () {
        if (vm.allSelected) {
          vm.selected = [];
          vm.allSelected = false;
        } else {
          vm.selected = _.pluck(vm.availableQuestions, '_id');
          vm.allSelected = true;
        }  
      };

      vm.addedToggleAll = function () {
        if (vm.addedAllSelected) {
          vm.addedSelected = [];
          vm.addedAllSelected = false;
        } else {
          vm.addedSelected = _.pluck(vm.tags.questions, '_id');
          vm.addedAllSelected = true;
        }  
      };

      vm.toggleSelected = function (questionId) {
        var idx = vm.selected.indexOf(questionId);
        if (idx > -1) {
          vm.selected.splice(idx, 1);
        } else {
          vm.selected.push(questionId);
        } 
      };

      vm.addedToggleSelected = function (questionId) {
        var idx = vm.addedSelected.indexOf(questionId);
        if (idx > -1) {
          vm.addedSelected.splice(idx, 1);
        } else {
          vm.addedSelected.push(questionId);
        } 
      };

      vm.clearQuestions = function () {
        console.log('clear', vm.selected);
        // TODO: I think I will have to loop through all questions and remove the 
        // association, which is a bit inefficient, but not sure how else to 
        // do it
      };

      vm.saveTag = function () {
        vm.tag.text.languages = 2;
        vm.tag.text.original_language = session.speaks;
        if (!vm.tag.description) {
          vm.tag.description = {
            languages: 2,
            original_language: session.speaks,
            translations: {}
          }
          vm.tag.description.transations[session.speaks] = '';
          vm.tag.description.transations[session.learning] = '';
        }
        var tagData = {
          text: vm.tag.text,
          description: vm.tag.description,
          search_index: vm.tag.search_index
        }
        Tag.one(vm.tag._id).patch(tagData).then(function() {
          Notify.alert("Tag updated.", {status: 'success'});
        }, function () {
          Notify.alert( "Server Problem.", {status: 'danger'});
        });
      };

      vm.handleFileSelect = function (evt) {
        // using lastChild here because we are expecting
        // this from a directive, otherwise we would use
        // evt.currentTarget
        var file=evt.currentTarget.lastChild.files[0];

        // upload it
        vm.tag.updateImage(file).then(function (tag) {
          vm.tag = tag;
        }, function (response) {
          console.log('error updating tag image', response);
        });
      };

    } // end activate
  ]);
})();

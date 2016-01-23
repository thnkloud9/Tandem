(function() {
    'use strict';

    angular.module('app.questions').controller('CreateQuestionModalController', [
      '$rootScope',
      '$q',
      '$uibModalInstance',
      'Question',
      'session',
      'ngDialog',
      'Notify',
      function CreateQuestionModalController(
          $rootScope,
          $q,
          $uibModalInstance,
          Question,
          session,
          ngDialog,
          Notify) {
            var self = this;

            activate();

            //////////////

            function activate() {
              self.session = session;
 
              self.ok = function () {
                $uibModalInstance.close('closed');
              };

              self.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };

               /**
                * set app level transation direction
                * can also be set in settings, and is stored
                * in localStorage
                */
              self.changeTranslationTo = function () {
                self.directionChanged = !self.directionChanged;
                if ($rootScope.app.translation.to === session.learning) {
                  $rootScope.app.translation.to = session.speaks;
                } else {
                  $rootScope.app.translation.to = session.learning;
                }
              };

              /**
               * Submit a new question to the server api using
               * the Question service
               */  
              self.saveQuestion = function () {
                self.direction = !self.direction;
                console.log('bind', self.speaksText, self.learningText);
                return true;

                var translations = {};
                translations[session.speaks] = self.newQuestion.speaksText;
                translations[session.learning] = self.newQuestion.learningText;
                var questionData = {
                  text: {
                    languages: 2,
                    original_language: session.speaks,
                    translations: translations
                  },
                  status: 'submitted',
                  category: self.newQuestion.category,
                  submitted_by: session.userId
                };
                Question.post(questionData).then(function (question) {
                  self.questions.add(question);
                  Notify.alert("Question Added.", {status: 'success'});
                }, function (response) {
                  Notify.alert("Server Problem", {status: 'danger'});
                });

              };

            } // end activate
        }
    ]);
})();

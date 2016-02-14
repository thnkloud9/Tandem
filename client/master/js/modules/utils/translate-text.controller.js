(function() {
    'use strict';

    angular.module('app.utils').controller('TranslateTextController', [
      '$sce',
      '$scope',
      '$rootScope',
      'session',
      'APP_CONFIG',
      'Notify',
      'mymemory',
      'duolingo',
      'googleSearch',
      function TranslateTextController(
          $sce,
          $scope,
          $rootScope,
          session,
          APP_CONFIG,
          Notify,
          mymemory,
          duolingo,
          googleSearch) {
            var self = this;

            activate();

            ////////////////

            function activate() {
              self.session = session;
              if (!self.model) {
                self.model = (self.initialText) ? self.initialText: 'click to enter content';
              }
              self.popoverContent = null;
              self.originalWords = [];
              self.editMode = false;
              self.hasMatches = false;
              self.showHints = false;
              self.mmMatches = false;
              self.dlMatches = false;
              self.gsMatches = false;
              // account from a to without a from, and
              // vice-versa
              if (self.to && !self.from) {
                self.from = (self.to === session.speaks) ? session.learning : session.speaks;
              }
              if (self.from && !self.to) {
                self.to = (self.from === session.speaks) ? session.learning : session.speaks;
              }
              // default if no from and to were provided
              self.to = (self.to) ? self.to : session.speaks;
              self.from = (self.from) ? self.from : session.learning;
   
              // watch our bind var for possible changes from another 
              // translate directive
              if (self.send) {
                $scope.$watch(angular.bind(self, function() {
                  return self.model;
                }), function(newVal, oldVal) {
                  if (newVal) {
                    // if we get an update to our model, our
                    // translations are no longer valid, so
                    // just get rid of them
                    self.showHints = false;
                    self.mmMatches = false;
                  }
                });
              }
              
              self.clearMatches = function () {
                self.hasMatches = false;
                self.mmMatches = false;
                self.dlMatches = false;
                self.gsMatches = false;
              };

              // called from directive
              self.useTranslation = function (text) {
                self.setTranslation(text, false);
                self.clearMatches();
              };

              // sets the main accepted translation  
              self.setTranslation = function (text, fromWatch) {
                self.translation = text;
                if (self.send && !fromWatch) {
                  self.modelTranslation = text;
                  //self.clearMatches();
                  self.showHints = true;
                  self.editMode = false;
                } else {
                  // if we aren't sending this anywhere, assume user
                  // wants to use it in the current input
                  self.model = text;
                  self.initiText = text;
                  self.showHints = false;
                  self.editMode = false;
                } 
              };

              self.edit = function() {
                self.editMode = true;
              };

              self.setToSpeaks = function() {
                self.to = session.speaks;
                self.from = session.learning;
              };

              self.setToLearning = function() {
                self.to = session.learning;
                self.from = session.speaks;
              }


              self.translate = function() {
                // make an array of each word to build the popover hints
                // we need to add spaces between all words this way
                self.originalWords = self.model.split(" ");
    
                if ($rootScope.app.translation.mymemory) {
                  mymemory.translateText(self.model, self.from, self.to).then(function (mmMatches) {
                      if (mmMatches) {
                        self.hasMatches = true;
                        self.mmMatches = mmMatches;
                        self.setTranslation(mmMatches[0].translation, false);
                      }
                  });
                }
                // dont do duloingo lookup when we arent sending the translation
                // to another element 
                if ($rootScope.app.translation.duolingo && self.send) {
                  duolingo.getTextHints(self.model, self.from, self.to).then(function (dlMatches) {
                    if (dlMatches) {
                      self.hasMatches = true;
                      self.dlMatches = dlMatches;
                      self.showHints = true;
                    }
                  });
                }

                if ($rootScope.app.translation.googleSearch) {
                  googleSearch.getSearchResults(self.model).then(function (gsMatches) {
                    if (gsMatches) {
                      self.hasMatches = true;
                      self.gsMatches = gsMatches;
                    }
                  });
                }

                self.editMode = false;
              };

              self.cancel = function() {
                self.editMode = false;
              };

              self.giveHints = function (originalWord) {
                var trusted = {};
                var tpl = '';

                // strip puncuation, as dl will do this as well
                originalWord = originalWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

                angular.forEach(self.dlMatches[originalWord], function (match) {
                  tpl += '<p class="translate-hint">' + match + '</p>';
                });
                self.popoverContent = $sce.trustAsHtml(tpl);
              };

            } // end activate
        }
    ]);
})();

(function() {
    'use strict';

    angular.module('app.dashboard').controller('DashboardController', [ 
        '$rootScope',
        '$scope',
        '$q',
        '$uibModal',
        'speechRecognition',
        'speechSynth',
        'ngAudio',
        'Tag',
        'PracticeSet',
        'Question',
        'session',
        function DashboardController(
            $rootScope,
            $scope,
            $q,
            $uibModal,
            speechRecognition,
            speechSynth,
            ngAudio,
            Tag,
            PracticeSet,
            Question,
            session) {
            var vm = this;

            activate();

            ////////////////

            function activate() {
              vm.tags = [];
              vm.tagsString = [];
              vm.typedTags = [];
              vm.selectedTags = [];
              vm.recognition = session.speaks;

              // start speech recognition
              speechRecognition.init(session.speaks);
              vm.player = ngAudio.load('');
              if ($rootScope.app.audio.speechRecognition) {
                speechRecognition.results = '...listening';
                if (speechRecognition.status !== 'started') {
                  speechRecognition.start();
                }
              }

              // TODO: move this to a function of speechRecognition
              // service, maybe listen on rootScope?
              vm.toggleSpeechRecognition = function () {
                $rootScope.app.audio.speechRecognition = !$rootScope.app.audio.speechRecognition;
                if ($rootScope.app.audio.speechRecognition) {
                  speechRecognition.results = '...listening';
                  if (speechRecognition.status !== 'started') {
                    speechRecognition.start();
                  }
                } else {
                  speechRecognition.stop();
                }
              };

              vm.speak = function(q) {
                var text = q.text.translations[session.learning];
                var code = session.learning;
                speechSynth.speak(text, code);
              };

              vm.createPracticeSet = function (questions) {
                var title = 'Topic generated Tandem';
                var total = 6; // total number of questions in the tandem session
                vm.tandemQuestions = questions;
                PracticeSet.buildFromQuestions(title, questions, total).then(function (practiceSet) {
                  // TODO: create practice session for this new practiceSet
                  // can be done the same way its done on tandems page, and can
                  // open in a model as well, so no duplicate code is needed
                  vm.tandemQuestions = practiceSet.questions;

                  $uibModal.open({
                    controller: 'PlayTandemPracticeSetModalController',
                    controllerAs: 'modalPlay',
                    templateUrl: 'app/views/modals/play-tandem-practice-set.html',
                    resolve: {
                      playingSet: function () {
                        return practiceSet;
                      }
                    },
                    size: 'lg'
                  });
                
                });
              };

              vm.addSelectedTag = function (newTag) {
                var selectedIds = _.pluck(vm.selectedTags, '_id');
                // make sure we haven't already added this topiv
                if (selectedIds.indexOf(newTag._id) === -1) {
                  vm.selectedTags.push(newTag);
                  // we have 2 topics, we can start a tandem session now
                  if (vm.selectedTags.length === 2) {
                    speechRecognition.stop();
                    Question.searchByTag(selectedIds).then(function (questions) {
                      // make a pracice session out of these questions?
                      vm.createPracticeSet(questions);      
                    }); 
                  }
                }
              };

              // load tag list
              Tag.getSearchableTags().then(function (searchTags) {
                vm.tagsString = searchTags.string;
                vm.tags = searchTags.tags;
                vm.tagOptions = searchTags.uniqueTags;

                // watch for typed tag updates
                $scope.$watch(angular.bind(vm, function() {
                  return vm.typedTags;
                }), function(newVal, oldVal) {
                  if (newVal.length > 0) {
                    var newTag = newVal[(newVal.length-1)];
                    vm.addSelectedTag(newTag);
                  }
                }); // end watch

                // listen for speech results
                $scope.$watch(angular.bind(speechRecognition, function () {
                  return speechRecognition.results;
                }), function (newVal, oldVal) {
                  if (newVal) {
                    vm.speech = newVal
                      .trim()
                      .toLowerCase()
                      .replace('[-,_]', ' ')
                      .replace(/['.\/#!$%\^&\*;:{}=\`~()]/g,"");
                    // check if we have a match on ANY tag string
                    if (vm.tagsString.indexOf(vm.speech) > -1) {
                      var matchedTag = _.findWhere(vm.tags, {"string": vm.speech});
                      vm.addSelectedTag(matchedTag);
                    }
                  }
                }); // end watch

              }); // end getSearcgableTags callback
            }

        }
    ]);
})();

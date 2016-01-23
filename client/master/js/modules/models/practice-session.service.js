(function() {
    'use strict';

    angular
        .module('app.models')
        .factory('PracticeSession', [
            '$http',
            '$q',
            '$window',
            'Restangular',
            'APP_CONFIG',
            'Question',
            'Recording',
            function ($http, $q, $window, Restangular, APP_CONFIG, Question, Recording) {
              var PracticeSession = Restangular.all('practice_sessions');

              // extend collection 
              Restangular.extendCollection('practice_sessions', function(collection) {
                return collection;
              });

              // extend model
              Restangular.extendModel('practice_sessions', function(model) {

                model.initQuestions = function () {
                  var deferedGet = $q.defer();
                  var currentIndex = 0;
                  var playQuestions = [];
                  var currentQuestion = null;

                  model.questions.forEach(function (question) {
                    // only add questions without answers
                    if (model.answers.indexOf(question._id) < 0) {
                      if (!model.currentQuestion) {
                        model.currentQuestion = question;
                        model.currentIndex = currentIndex;
                      };
                      playQuestions.push(question);
                      currentIndex++;
                    }
                  });
                  model.playQuestions = playQuestions;
                  currentQuestion = playQuestions[0];
                  Question.get(currentQuestion._id).then(function (question) {
                    question.loadRecordingIndex().then(function () {
                      model.currentQuestion = question;
                      deferedGet.resolve();
                    });
                  });

                  return deferedGet.promise;
                };

                model.loadNextQuestion = function () {
                  var deferedGet = $q.defer();
                  var currentQuestion = null;

                  model.currentIndex = model.currentIndex + 1;
                  if (model.currentIndex > (model.playQuestions.length - 1)) {
                    model.currentIndex = model.playQuestions.length - 1;
                  }
                  if (model.currentIndex === (model.playQuestions.length - 1)) {
                    model.lastQuestion = true;
                  }

                  model.currentQuestion = model.playQuestions[model.currentIndex];

                  Question.get(model.currentQuestion._id).then(function (question) {
                    question.loadRecordingIndex().then(function () {
                      model.currentQuestion = question;
                      deferedGet.resolve(model.currentQuestion);
                    });
                  });
                
                  return deferedGet.promise;
                };

                return model;
              });
          
              // checks for an existing non-completed practiceSession for the given
              // practice set
              PracticeSession.initFromPracticeSet = function (practiceSet) {
                var deferedGet = $q.defer();
                var practiceSession = null;
                var submittedBy = $window.sessionStorage.getItem('user_id');
                var filter = {
                  practice_set: practiceSet._id,
                  platform: 'web',
                  status: 'started',
                  submitted_by: submittedBy
                };
                var params = {
                  sort: "-_created",
                  where: filter,
                  embedded: {"questions": 1}
                }

                PracticeSession.getList(params).then(function (practiceSessions) {;
                  if (practiceSessions.length > 0) {
                    deferedGet.resolve(practiceSessions[0]);
                  } else {
                    // create a new PracticeSession
                    var data = {
                      practice_set: practiceSet._id,
                      questions: practiceSet.questions
                    };
                    PracticeSession.create(data).then(function (newPracticeSession) {
                      deferedGet.resolve(newPracticeSession);
                    });
                  };
                });
                
                return deferedGet.promise;
              };

              PracticeSession.create = function (practiceSession) {
                var deferedPost = $q.defer();
                var questions = (practiceSession.questions) ? practiceSession.questions : [];
                var submittedBy = $window.sessionStorage.getItem('user_id');
                var request = {
                  method: 'POST',
                  url: APP_CONFIG.API.full + '/practice_sessions',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  data: {
                    practice_set: practiceSession.practice_set,
                    status: 'started',
                    platform: 'web',
                    audio: [],
                    answers: [],
                    questions: questions,
                    submitted_by: submittedBy 
                  }
                };

                $http(request)
                .then(function (response) {
                  var resourceId = response.data._id;
                  var embed = {
                    "questions": 1,
                    "submitted_by": 1,
                  };
                  var request = {
                    method: 'GET',
                    url: APP_CONFIG.API.full + '/practice_sessions/'+resourceId + '?embedded=' + JSON.stringify(embed),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  };
                  return $http(request);  // retrieve new practiceSession 
                }, $q.reject)
                .then(function (response) {
                  PracticeSession.get(response.data._id, {"embedded": {"questions": 1 }}).then(function (practiceSession) {
                    deferedPost.resolve(practiceSession);
                  });
                }, function () {
                  deferedPost.reject();
                });

                return deferedPost.promise;
              };

              return PracticeSession;
            }

        ]);
})();
    

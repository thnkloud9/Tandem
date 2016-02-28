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
            'Comment',
            function ($http, $q, $window, Restangular, APP_CONFIG, Question, Recording, Comment) {
              var PracticeSession = Restangular.all('practice_sessions');

              // extend collection 
              Restangular.extendCollection('practice_sessions', function(collection) {
                return collection;
              });

              // extend model
              Restangular.extendModel('practice_sessions', function(model) {

                /**
                 * Queues the current question and set up all required
                 * subsequent questions based on the already saved 
                 * answers
                 */
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

                /**
                 * Queues the the nexxt required question to be answered
                 */
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
   
                /**
                 * Hydrate the audio.  Used when the session is loaded
                 * for review only.  Calling this property sessionAudio
                 * so it is not confused with session.audio, which is
                 * simple _id values
                 */
                model.initSessionAudio = function () {
                  var deferedGet = $q.defer();
                  var sessionAudios = [];
                  var params = {
                    embedded: {
                      question: 1,
                      submitted_by: 1,
                      parent_audio: 1,
                      questions: 1,
                      affected_user: 1
                    },
                    sort: "_created"
                  };
                  
                  model.audio.forEach(function (audio) {
                    Recording.one(audio).get(params).then(function (a) {
                      // get comments for this audio
                      var params = {
                        where: { parent: a._id },
                        embedded: {
                          submitted_by: 1
                        }
                      }
                      Comment.getList(params).then(function (comments) { 
                        // add comments
                        a.comments = comments;
                        // setup the audio url for playback in player
                        // I would have used local url if createBlob
                        // was available, but it is not included when using
                        // restangular one() for some reason
                        a.audioUrl = APP_CONFIG.API.rootURI + '/assets/audio/' + a._id;  
                        // setup profile image
                        if (a.submitted_by.image) {
                          a.profileImage = APP_CONFIG.API.rootURI + '/assets/profile_images/' + a.submitted_by._id;
                        } else {
                          a.profileImage = '/app/img/default-profile.jpg';
                        }
                        // makde _created a real date
                        a._created = new Date(a._created)
                        sessionAudios.push(a);
                        if (sessionAudios.length === model.audio.length) {
                          model.sessionAudios = sessionAudios;
                          deferedGet.resolve(model);
                        }
                      }); // end Comment.getList
                    }); // end Recording one
                  }); // end audio forEach
                  return deferedGet.promise;
                };

                model.initTimeline = function () {
                  var deferedGet = $q.defer();
                  var timelineEvents = [];
               
                  // TODO: memorize session will not have any audio, so first check
                  // type of session this is

                  // first lets hydrate the audios (they are just ids otherwise)
                  model.initSessionAudio().then(function (m) {
                    var answers = _.where(m.sessionAudios, {context: 'answer'});
                    var questions = _.where(m.sessionAudios, {context: 'question'});
                    // here we have to order by the answers, and fake the
                    // question time, since the question audio could have
                    // been recorded anytime before, prehaps weeks/months/years
                    // before.
                    var sortedAnswers = _.sortBy(answers, function(a) { 
                      return Math.min(a._created);
                    });

                    // these should already be in order
                    var step = 0;
                    sortedAnswers.forEach(function (answer) {
                      step++;
                      // so now find the question that does with this answer
                      var question = _.findWhere(questions, { question: { _id: answer.question._id } });
                      if (question) {
                        // this was user generated audio
                        timelineEvents.push({
                          audio: question,
                          happened: answer._created,
                          step: step
                        });
                      } else {
                        // this was text-to-speech audio, so we have to buidl a
                        // fake audio object
                        timelineEvents.push({
                          audio: {
                            context: 'question',
                            question_text: answer.question_text,
                            submitted_by: {
                              username: 'robots!!!'
                            },
                            _created: answer._created,
                            profileImage: '/app/img/default-profile.jpg',
                          },
                          happened: answer._created,
                          step: step
                        });
                      }

                      step++;
                      timelineEvents.push({
                        audio: answer,
                        happened: answer._created,
                        step: step
                      });
                    });

                    model.timelineEvents = timelineEvents;

                    deferedGet.resolve(model);
                  });
                  return deferedGet.promise;
                };

                return model;
              });
         
              PracticeSession.reduceToIds = function (list) {
                var idList = [];
                angular.forEach(list, function (item) {
                  if (item.restangularized) {
                    idList.push(item._id);
                  } else {
                    // only push if its a string, otherwise
                    // do nothing with it
                    if (typeof item === 'string') {
                      idList.push(item);
                    }
                  } 
                });
            
                return idList;
              };
 
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
                    // if questions are restangularized, convert them back to
                    // plain old ids
                    var questionList = PracticeSession.reduceToIds(practiceSet.questions);
                    // create a new PracticeSession
                    var data = {
                      practice_set: practiceSet._id,
                      questions: questionList
                    };
                    PracticeSession.create(data).then(function (newPracticeSession) {
                      deferedGet.resolve(newPracticeSession);
                    }, function (response) {
                      console.log('error creating practice session', response);
                      deferedGet.reject();
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
                    questions: PracticeSession.reduceToIds(questions),
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
    

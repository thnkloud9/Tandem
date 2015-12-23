'use strict';

/**
 * @ngdoc function
 * @name tandemWebApp.controller:RatingsCtrl
 * @description
 * # RatingsCtrl
 * Controller of the tandemWebApp
 */
angular.module('tandemWebApp')
.controller('RatingsCtrl', [
  '$scope',
  '$q',
  'toaster',
  'Restangular',
  'Recording',
  'Activity',
  'config',
  'session',
  function ($scope, $q, toaster, Restangular, Recording, Activity, config, session) {
    var self = this;

    self.rateMax = 5;
    self.Ratings = Restangular.all('ratings');
    self.ratingSum = 0;
    self.ratingCount = 0;
    self.ratingUser = 0;

    self.getRating = function () {
      if ((typeof self.element === 'undefined') ||
          (!self.element)) {
        return false;
      }
      var params = {
        where: {
          parent: self.element._id
        }
      }
      Restangular.one('ratings').get(params).then(function (ratings) {
        ratings._items.forEach(function (rating) {
            self.ratingSum = self.ratingSum + rating.rating;
            self.ratingCount = self.ratingCount + 1;
            self.rating = Math.round(self.ratingSum / self.ratingCount);
            self.element.rating = Math.round(self.ratingSum / self.ratingCount);
            if (rating.submitted_by === session.userId) {
              self.ratingUser = rating.rating;
            }
        });
        self.setRateText(self.rating);
      });
    };

    self.getUserRating = function () {
      var params = {
        where: {
          parent: self.element._id,
          submitted_by: session.userId
        }
      }
      Restangular.one('ratings').get(params).then(function (ratings) {
        ratings._items.forEach(function (rating) {
            self.rating = rating.rating;
            self.element.rating = rating.rating;
        });
      });
    };
 
    // init element
    self.elementWatch = $scope.$watch(angular.bind(self, function () {
      return self.element;
    }), function (newVal, oldVal) {
      if (typeof newVal !== 'object') {
        if (typeof newVal !== 'undefined') {
          Recording.get(newVal).then(function (audio) {
            self.element = audio;
            self.getRating();
          });
        }
      } else {
        self.element = newVal;
        self.getRating();
      }
    });

    self.rateHovering = function (value) {
      self.overStar = value;
      self.rating = value;
      self.setRateText(value);
    };

    self.setRateText = function (value) {
      if ((!value) || (value === 0)) {
        self.rateText = 'No Rating yet';
        self.rateClass = 'label-danger';
      }
      if (value === 1) {
        self.rateText = 'Bad or no audio';
        self.rateClass = 'label-danger';
      }
      if (value === 2) {
        self.rateText = 'Could not understand';
        self.rateClass = 'label-danger';
      }
      if (value === 3) {
        self.rateText = 'Bad Grammer';
        self.rateClass = 'label-warning';
      }
      if (value === 4) {
        self.rateText = 'Bad Pronunciation';
        self.rateClass = 'label-info';
      }
      if (value === 5) {
        self.rateText = 'Good';
        self.rateClass = 'label-success';
      }
    };

    self.rateLeave = function () {
      self.overStar = self.element.rating
      self.setRateText(self.element.rating);
    };

    self.saveRating = function () {
      var newRating = {
        context: self.element.context,
        parent: self.element._id,
        language_code: self.element.language_code,
        submitted_by: session.userId
      }
    
      // remove any existing rating for this element
      // by this user
      self.Ratings.getList({where: newRating}).then(function (ratings) {
        ratings.forEach(function (rating) {
          rating.remove();
        });
      }, $q.reject).then(function () {
        // now save the new rating
        newRating.rating = self.rating;
        newRating.affected_user = self.element.submitted_by._id;
        self.Ratings.post(newRating).then(function(rating) {
          // save user activity
          var activityData = {
            "action": "rated",
            "context": self.element.context,
            "affected_object": self.element._id,
            "affected_user": self.element.submitted_by._id,
            "submitted_by": session.userId
          }
          Activity.post(activityData).then(function (activity) {
            toaster.pop('success', 'Rating Saved', 'Your rating has been saved.');
            if (typeof self.onSave === 'function') {
              self.onSave(rating);
            }
            self.ratingUser = self.rating;
          }, function (response) {
            toaster.pop('error', 'Server Error', 'There was a problem saving the rating. Please try again in a few moments.');
          });
        });
      });
    };

  }
]);
   

'use strict';

/**
 * @ngdoc function
 * @name app.ratings:RatingsCtrl
 * @description
 * # RatingsCtrl
 */
angular.module('app.ratings')
.controller('RatingsCtrl', [
  '$scope',
  '$q',
  'toaster',
  'Restangular',
  'Recording',
  'Activity',
  'session',
  function ($scope, $q, toaster, Restangular, Recording, Activity, session) {
    var vm = this;

    vm.rateMax = 5;
    vm.Ratings = Restangular.all('ratings');
    vm.ratingSum = 0;
    vm.ratingCount = 0;
    vm.ratingUser = 0;

    vm.getRating = function () {
      if ((typeof vm.element === 'undefined') ||
          (!vm.element)) {
        return false;
      }
      var params = {
        where: {
          parent: vm.element._id
        }
      }
      Restangular.one('ratings').get(params).then(function (ratings) {
        ratings._items.forEach(function (rating) {
            vm.ratingSum = vm.ratingSum + rating.rating;
            vm.ratingCount = vm.ratingCount + 1;
            vm.rating = Math.round(vm.ratingSum / vm.ratingCount);
            vm.element.rating = Math.round(vm.ratingSum / vm.ratingCount);
            if (rating.submitted_by === session.userId) {
              vm.ratingUser = rating.rating;
            }
        });
        vm.setRateText(vm.rating);
      });
    };

    vm.getUserRating = function () {
      var params = {
        where: {
          parent: vm.element._id,
          submitted_by: session.userId
        }
      }
      Restangular.one('ratings').get(params).then(function (ratings) {
        ratings._items.forEach(function (rating) {
            vm.rating = rating.rating;
            vm.element.rating = rating.rating;
        });
      });
    };
 
    // init element
    vm.elementWatch = $scope.$watch(angular.bind(vm, function () {
      return vm.element;
    }), function (newVal, oldVal) {
      if (typeof newVal !== 'object') {
        if (typeof newVal !== 'undefined') {
          Recording.get(newVal).then(function (audio) {
            vm.element = audio;
            vm.getRating();
          });
        }
      } else {
        vm.element = newVal;
        vm.getRating();
      }
    });

    vm.rateHovering = function (value) {
      vm.overStar = value;
      vm.rating = value;
      vm.setRateText(value);
    };

    vm.setRateText = function (value) {
      if ((!value) || (value === 0)) {
        vm.rateText = 'No Rating yet';
        vm.rateClass = 'label-danger';
      }
      if (value === 1) {
        vm.rateText = 'Bad or no audio';
        vm.rateClass = 'label-danger';
      }
      if (value === 2) {
        vm.rateText = 'Could not understand';
        vm.rateClass = 'label-danger';
      }
      if (value === 3) {
        vm.rateText = 'Bad Grammer';
        vm.rateClass = 'label-warning';
      }
      if (value === 4) {
        vm.rateText = 'Bad Pronunciation';
        vm.rateClass = 'label-info';
      }
      if (value === 5) {
        vm.rateText = 'Good';
        vm.rateClass = 'label-success';
      }
    };

    vm.rateLeave = function () {
      vm.overStar = vm.element.rating
      vm.setRateText(vm.element.rating);
    };

    vm.saveRating = function () {
      var newRating = {
        context: vm.element.context,
        parent: vm.element._id,
        language_code: vm.element.language_code,
        submitted_by: session.userId
      }
    
      // remove any existing rating for this element
      // by this user
      vm.Ratings.getList({where: newRating}).then(function (ratings) {
        ratings.forEach(function (rating) {
          rating.remove();
        });
      }, $q.reject).then(function () {
        // now save the new rating
        newRating.rating = vm.rating;
        newRating.affected_user = vm.element.submitted_by._id;
        vm.Ratings.post(newRating).then(function(rating) {
          // save user activity
          var activityData = {
            "action": "rated",
            "context": vm.element.context,
            "affected_object": vm.element._id,
            "affected_user": vm.element.submitted_by._id,
            "submitted_by": session.userId
          }
          Activity.post(activityData).then(function (activity) {
            toaster.pop('success', 'Rating Saved', 'Your rating has been saved.');
            if (typeof vm.onSave === 'function') {
              vm.onSave(rating);
            }
            vm.ratingUser = vm.rating;
          }, function (response) {
            toaster.pop('error', 'Server Error', 'There was a problem saving the rating. Please try again in a few moments.');
          });
        });
      });
    };

  }
]);
   

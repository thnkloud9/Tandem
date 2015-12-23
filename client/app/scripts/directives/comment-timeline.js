'use strict';
  
angular.module('tandemWebApp').directive('commentTimeline', [ 
  '$rootScope',
  'config',
  function ($rootScope, config) {
    return {
        template: '<div class="comment-timeline"> </div>',
        restrict: 'E',
        scope: {
          comments: '=',
          recording: '=',
          clickCallback: '&onTimelineClick'
        },
        link: function postLink(scope, element, attrs) {
          var remaining = 100;
          var used = 0;

          function redraw(comments) {
            var start = 0;
            var width = 0;
            var end = 100;
            var html = '';

            element.html(html);
            angular.forEach(comments, function(comment) {
              width = Math.round(comment.progress * 100) - start;
              html = '<div class="timeline-filler" style="width: '+width+'%;"></div>';
              element.append(html); 
              html = '<div class="timeline-comment" style="width: 5%;">'
              html += '<img src="'+ config.API.rootURI +'/assets/profile_images/' + comment.submitted_by + '" ';
              html += 'class="profile-img-tiny" />';
              html += '</div>';
              element.append(html);
              start += width + 7; 
            });
            if (start < end) { 
              width = 100 - start;
              html = '<div class="timeline-filler" style="width: '+width+'%;"></div>';
              element.append(html); 
            }
            $('.comment-timeline-text').remove();
            element.after('<div class="comment-timeline-text"></div>');
          };

          function show (comment) {
            var html = '<div class="slide-animation">';
            html += '<span><a class="nounderline" href="#/users/' + comment.submitted_by + '">';
            html += comment.username + '</a> ' + comment.text+'</span>';
            html += '</div>';
            // TODO: add some jquery or angular animation here?
            $('.comment-timeline-text').html(html);
          };

          //redraw(scope.comments);
            
          $rootScope.$on('update-timeline-comments', function (e, comments) {
            redraw(comments);
          });

          $rootScope.$on('show-timeline-comment', function (e, comment) {
            show(comment);
          });
          
        }
    };      
  }
]);

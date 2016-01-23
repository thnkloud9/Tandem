(function() {
    'use strict';

    angular.module('app.utils').directive('translateText', [
        '$compile',
        function ($compile) {
          return {
            templateUrl: 'app/views/translate-text.html',
            restrict: 'A',
            controller: 'TranslateTextController',
            controllerAs: 'translate',
            scope: {
                allowChange: '='
            },
            bindToController: {
                initialText: '@', // text displaed before first click
                from: '@', // langaugeCode ('en', 'de', etc)
                to: '@', // langaugeCode ('en', 'de', etc)
                model: '=', // model var to bind to
                // TODO: send shouldn't be needed here, but I can't figure out
                // how to detect if bind-translation was set in the directive
                // controller, I can only get the VALUE of it. HELP
                send: '=', // tells if we should send translation to bind-translation
                modelTranslation: '=' // model to bind translation to
            },
            link: function (scope, element, attr, controller) {
   
                var oldContent = element.contents();
                var newContent = null;
              
                // update bind value when input text is changed 
                $(element).find(':input').on('input', function(e){
                  controller.model = $(this).val();
                });

                // select all text when the input itself is clicked
                $(element).find(':input').on('click', function(e){
                   $(this).select();
                });

                // select all text when any part of the element is clicked
                $(element).on('click', function(e){
                   $(this).find(':input').select();
                });
            }
          } 
        }
    ]);
})();

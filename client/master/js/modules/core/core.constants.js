/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('APP_MEDIAQUERY', {
          'desktopLG':             1200,
          'desktop':                992,
          'tablet':                 768,
          'mobile':                 480
        })
        .constant('APP_CONFIG', {
          // API urls
          API: {
              rootURI: 'https://tandem.dev/api',
              endpoint: '/api/v1/',
              full: 'https://tandem.dev/api/v1'
          },
          mymemory: {
              rootURI: 'https://api.mymemory.translated.net/'
          },
          duolingo: {
              apiURI: 'https://api.duolingo.com/',
              dictURI: 'https://d2.duolingo.com/api/1/dictionary/',
              ttsURI: 'https://d7mj4aqfscim2.cloudfront.net/'
          },
          gcse: {
              apiURI: 'https://www.googleapis.com/customsearch/v1',
              apiKey: 'AIzaSyCqtneeGqDwpeWJHEvm2daOBNrAmJOdNn0&cx=006561381899366895267:dtmrsefnen0'
          },
          leo: {
            linkURI: 'https://dict.leo.org/ende/index_de.html#/search=' 
          },
          // languages 
          languages: [
              { 
                  text: {
                      translations: {
                          en: 'English',
                          de: 'Englisch',
                          es: 'inglés'
                      }
                  },
                  code: 'en'
              },
              { 
                  text: {
                      translations: {
                          en: 'German',
                          de: 'Deutsch',
                          es: 'alemán'
                      }
                  },
                  code: 'de'
              },
              { 
                  text: {
                      translations: {
                          en: 'Spanish',
                          de: 'Spanisch',
                          es: 'español'
                      }
                  },
                  code: 'es'
              }
          ]
          // end languages 
        })
      ;

})();

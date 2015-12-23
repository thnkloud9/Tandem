'use strict';

/* authentication and user function. */
angular.module('tandemWebApp').factory('config', function() {
  return {
    // API urls
    API: {
      //rootURI: 'https://tandem.marklewis.me',
      rootURI: 'http://localhost:5000',
      endpoint: '/api/v1/',
      full: 'http://localhost:5000/api/v1'
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
  };
});

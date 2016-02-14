/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS
 * 
 * Version: 3.2.0
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 * 
 */

// APP START
// ----------------------------------- 

(function() {
    'use strict';

    angular
        .module('tandem', [
            'app.core',
            'app.session',
            'app.checkauth',
            'app.routes',
            'app.authInterceptor',
            'app.modalFactory',
            'app.audio',
            'app.images',
            'app.sidebar',
            'app.forms',
            'app.navsearch',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.admin',
            'app.dashboard',
            'app.notify',
            'app.charts',
            'app.search',
            'app.panels',
            'app.locale',
            'app.maps',
            'app.pages',
            'app.utils',
            'app.models',
            'app.profile',
            'app.tags',
            'app.questions',
            'app.practiceSets',
            'app.mymemory',
            'app.duolingo',
            'app.google'
        ]);
})();


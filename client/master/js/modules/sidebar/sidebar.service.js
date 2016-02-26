(function() {
    'use strict';

    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);

    SidebarLoader.$inject = ['session'];
    function SidebarLoader(session) {
        this.getMenu = getMenu;

        // all menu items, including admin
        this.items = [
          {
            "text": "Dashboard",
            "sref": "app.dashboard",
            "icon": "icon-home",
            "label": "label label-info", 
            "translate": "sidebar.nav.DASHBOARD"
          },
          {
            "text": "Tandems",
            "sref": "app.tandems",
            "icon": "icon-bubbles",
            "translate": "sidebar.nav.TANDEMS"
          },
          {
            "text": "Word Lists",
            "sref": "app.word-lists",
            "icon": "icon-notebook",
            "translate": "sidebar.nav.WORDLISTS"
          },
          {
            "text": "Tags",
            "sref": "app.tags",
            "icon": "icon-tag",
            "translate": "sidebar.nav.TAGS"
          },
          {
            "text": "Questions",
            "sref": "app.questions",
            "icon": "icon-question",
            "translate": "sidebar.nav.QUESTIONS"
          },
          {
            "text": "Admin",
            "sref": "#",
            "icon": "icon-wrench",
            "role": "admin",
            "submenu": [
              { "text": "Practice Sets", "sref": "admin.practice-sets", "translate": "sidebar.nav.admin.PRACTICESETS" },
              { "text": "Practice Sessions", "sref": "admin.practice-sessions", "translate": "sidebar.nav.admin.PRACTICESESSIONS" },
              { "text": "Questions", "sref": "admin.questions", "translate": "sidebar.nav.admin.QUESTIONS" },
              { "text": "Tags", "sref": "admin.tags", "translate": "sidebar.nav.admin.TAGS" },
              { "text": "Audio", "sref": "admin.audio", "translate": "sidebar.nav.admin.AUDIO" },
              { "text": "Users",   "sref": "admin.users", "translate": "sidebar.nav.admin.USERS" },
              { "text": "Ratings", "sref": "admin.ratings", "translate": "sidebar.nav.admin.RATINGS" },
              { "text": "Comments", "sref": "admin.comments", "translate": "sidebar.nav.admin.COMMENTS" }
            ],
            "translate": "sidebar.nav.ADMIN"
          }
        ];

        ////////////////

        function getMenu() {
          //if (session.roles.indexOf('admin') === -1) {
          if (session.roles !== 'admin') {
            this.items = _.reject(this.items, function (item) {
              return item.role === 'admin';
            });
          }  
          return this.items;
        }
    }
})();

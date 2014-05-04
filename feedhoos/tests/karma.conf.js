module.exports = function(config){
    config.set({
        basePath : '../',
        files : [
            "finder/static/js/angular.min.js",   
            "finder/static/js/angular-route.min.js",   
            "finder/static/js/angular-sanitize.min.js",
            "finder/static/js/angular-cookies.min.js",
            "finder/static/js/angular-mocks.js",
            "finder/static/js/ui-bootstrap-tpls-0.10.0.js",
            "finder/static/js/test_feedhoos.js",
            "finder/static/js/services/setter.js",
            "finder/static/js/services/base_manager.js",
            "finder/static/js/services/base_feed_manager.js",
            "finder/static/js/services/reading_manager.js",
            "finder/static/js/services/timeline_manager.js",
            "finder/static/js/services/folder_manager.js",
            "finder/static/js/services/bookmark_manager.js",
            "finder/static/js/services/base_entry_manager.js",
            "finder/static/js/services/reading_entry_manager.js",
            "finder/static/js/services/folder_entry_manager.js",
            "finder/static/js/services/timeline_entry_manager.js",
            "finder/static/js/directives/rating.js",
            "finder/static/js/directives/remove_feed.js",
            "finder/static/js/directives/setter_resize.js",
            "finder/static/js/directives/create_folder.js",
            "finder/static/js/directives/select_folder.js",
            "finder/static/js/directives/scroll_top.js",
            "finder/static/js/directives/justify_entry.js",
            "finder/static/js/controllers/reader.js",
            "finder/static/js/controllers/list.js",
            "finder/static/js/controllers/finder.js",
            "finder/static/js/controllers/folder.js",
            "finder/static/js/test/services/bookmark_manager_spec.js",
            "finder/static/js/test/services/timeline_manager_spec.js",
            "finder/static/js/test/services/timeline_entry_manager_spec.js",
            "finder/static/js/test/services/reading_manager_spec.js",
            "finder/static/js/test/services/reading_entry_manager_spec.js",
            "finder/static/js/test/services/folder_manager_spec.js"
        ],
       autoWatch : true,
       port: 46000,
       frameworks: ['jasmine'],
       browsers : ['PhantomJS'],
       plugins : [
           "karma-junit-reporter",
           "karma-phantomjs-launcher",
           'karma-jasmine'
       ],
       junitReporter : {
           outputFile: 'test_out/unit.xml',
           suite: 'unit'
       }

    });
};

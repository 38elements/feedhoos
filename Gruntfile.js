var prefix_template = 'feedhoos.run(["$rootScope", "$window", "$document", "fhSetter", "$templateCache",' + "\n" +
    'function($rootScope, $window, $document,  fhSetter, $templateCache) {' + "\n" +
        '$rootScope.feedhoos = {};' + "\n" +
        '$window.addEventListener("resize", fhSetter.resize, false);' + "\n" +
        '$document.bind("keyup", fhSetter.shortcut);';
var suffix_template = "}\n" +
    "]);\n";

module.exports = function(grunt) {
    grunt.initConfig({
        ngtemplates: {
            feedhoos: {
                src: 'feedhoos/finder/static/partials/**.html',
                dest: 'feedhoos/finder/static/js/templates.js',
                options: {
                    bootstrap: function(module, script) {
                        return prefix_template + script + suffix_template;
                    }
                }
            }
        },
        watch: {
            templates: {
                files: "<%= ngtemplates.feedhoos.src %>",
                tasks: "ngtemplates:feedhoos"
            }
        }
    });
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ["ngtemplates", "watch"]);
};

var feedhoos = angular.module("feedhoos", ["ngCookies", "ngRoute", 'ngSanitize', "ui.bootstrap", "feedhoosControllers"]);

feedhoos.config(["$routeProvider",
    function($routeProvider) {
        $routeProvider.
        when("/reader", {
            templateUrl: "feedhoos/finder/static/partials/reader.html",
            controller: "ReaderCtrl"
        }).
        when("/reader/list", {
            templateUrl: "feedhoos/finder/static/partials/list.html",
            controller: "ListCtrl"
        }).
        when("/finder", {
            templateUrl: "feedhoos/finder/static/partials/finder.html",
            controller: "FinderCtrl"
        }).
        when("/folder", {
            templateUrl: "feedhoos/finder/static/partials/folder.html",
            controller: "FolderCtrl"
        }).
        otherwise({
            redirectTo: "/reader"
        });
    }
]);

//        feedhoos.filter("timeline_url", function() {
//            return function(feed_id) {
//                return "/reader/feed/timeline/" + feed_id + "/page/1/"
//            }
//       });
var feedhoosControllers = angular.module("feedhoosControllers", []);
feedhoosControllers.config([
    function() {
    }
]);

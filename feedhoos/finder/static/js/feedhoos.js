var feedhoos = angular.module("feedhoos", ["ngCookies", "ngRoute", 'ngSanitize', "ui.bootstrap", "feedhoosControllers"]);
feedhoos.factory("uiSetter",function(){
    var uiSetter = {
        bar: function() {
            var content_bar = document.getElementById("content_bar");
            var feed_bar = document.getElementById("feed_bar");
            try {
                var content_bar_top = content_bar.getBoundingClientRect().top 
                var feed_bar_top = feed_bar.getBoundingClientRect().top 
            } catch (e) {
                return
            }
            var innerHeight = window.innerHeight;
            content_bar.style.height = innerHeight - content_bar_top + "px";
            feed_bar.style.height = innerHeight - feed_bar_top + "px";
        },
        timeline_url: function(feed_id) {
            return "/reader/feed/timeline/" + feed_id + "/page/1/";
        },
        feed_url: function(feed_id) {
            return "/reader/feed/" + feed_id + "/page/1/";
        }
    };
    
    window.addEventListener("resize", uiSetter.bar, false);
    return uiSetter;
});

feedhoos.service("readingManager", ["$http", "$rootScope", function($http, $rootScope){
    var that = this;
    this.readings = null;
    this.request = function() {
        if (this.readings === null) {
            $http.get("/reader/feed/reading/").success(function(data) {
                that.readings = data;
                $rootScope.$broadcast("readings");
            });
        }
        else {
            $rootScope.$broadcast("readings");
        }
    };
}]);

feedhoos.service("feedManager", ["$http", "$rootScope", function($http, $rootScope){
    var that = this;
    this.feeds = null;
    this.request = function() {
        if (this.feeds === null) {
            $http.get("/reader/feed/list/all/").success(function(data) {
                that.feeds = data;
                $rootScope.$broadcast("feeds");
            });
        }
        else {
            $rootScope.$broadcast("feeds");
        }
    };
}]);

feedhoos.config(["$routeProvider",
    function($routeProvider) {
        $routeProvider.
        when("/reader", {
            templateUrl: "/static/partials/reader.html",
            controller: "ReaderCtrl"
        }).
        when("/reader/list", {
            templateUrl: "/static/partials/list.html",
            controller: "ListCtrl"
        }).
        when("/finder", {
            templateUrl: "/static/partials/finder.html",
            controller: "FinderCtrl"
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
feedhoosControllers.controller(
    "ReaderCtrl",
    ["$scope", "$routeParams", "$http", "uiSetter", "readingManager", "feedManager", 
    function($scope, $routeParams, $http, uiSetter, readingManager, feedManager) {
        uiSetter.bar()

        $scope.type = "";
        $scope._feed_id = null;
        $scope.feed = null;
        $scope.entries = null;
        $scope.feeds = [];
        $scope.active_feed_id = -1;
        $scope.active_timeline_id = -1;
        $scope.feed_tab = true;
        $scope.timeline_tab = true;
        $scope.$on("feeds", function() {
            $scope.feeds = feedManager.feeds;
        });
        feedManager.request();
        $scope.$on("readings", function() {
            $scope.readings = readingManager.readings;
        });
        readingManager.request();
        $scope.read_timeline = function(feed_id) {
            if ($scope._feed_id == feed_id && $scope.type == "timeline") {
                return;
            }
            $scope._feed_id = feed_id;
            $scope.type = "timeline";
            $scope.active_timeline_id = feed_id;
            var timeline_url = uiSetter.timeline_url(feed_id);
            $http.get(timeline_url).success(function(data) {
                $scope.feed = data.feed;
                $scope.entries = data.entries;
            });
        }
        $scope.read_feed = function(feed_id) {
            if ($scope._feed_id == feed_id && $scope.type == "feed") {
                return;
            }
            $scope._feed_id = feed_id;
            $scope.type = "feed";
            $scope.active_feed_id = feed_id;
            var feed_url = uiSetter.feed_url(feed_id);
            $http.get(feed_url).success(function(data) {
                $scope.feed = data.feed;
                $scope.entries = data.entries;
            });
            $scope.readings.map(function(feed){
                if (feed.id == feed_id) {
                    feed.unread_count = 0;
                }
            });
        }
    }]
)
.directive("scrollTop", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs, ReaderCtrl) {
            scope.$watch(function() {
                if (scope.feed) {
                    return (scope.feed.id + scope.type);
                }
                else {
                    return scope.feed;
                }
            }, function() {
                element[0].scrollIntoView();
            });
        },
    }
});


feedhoosControllers.controller("ListCtrl", ["$scope", "$http", "$cookies", 
    function($scope, $http, $cookies) {
        $http.get("/reader/feed/list/all/").success(function(data) {
            data.shift();
            $scope.feeds = data;
        });
        $http.get("/bookmark/list/").success(function(data) {
            $scope.bookmark = data;
        });
        $scope.remove = function(feed_id) {
            var csrftoken = $cookies.csrftoken;
            $http({
                 "url": "/reader/feed/list/delete/",
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {'Content-Type': 'application/x-www-form-urlencoded'},
                 "data": "feed_id=" + feed_id
            }).success(function(data) {
                data.shift();
                $scope.feeds = data;
            });
        }
    }]
);

feedhoosControllers.controller("FinderCtrl", ["$scope", "$http", "$cookies", 
    function($scope, $http, $cookies) {
        $scope.state = 1;
        $scope.set_state = function(state) {
            $scope.url = null;
            $scope.feed_urls = null;
            $scope.result = null;
            $scope.state = state;
        }
        $scope.search = function() {
            $scope.state = 2;
            $scope.feed_urls = null;
            var csrftoken = $cookies.csrftoken;
            $http({
                 "url": "/finder/get/",
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {'Content-Type': 'application/x-www-form-urlencoded'},
                 "data": "url=" + $scope.url
            }).success(function(data) {
                $scope.feed_urls = data;
            });
        }
        $scope.add = function(fu) {
            $scope.state = 3;
            $scope.result = null;
            var csrftoken = $cookies.csrftoken;
            $http({
                 "url": "/finder/registered/",
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {'Content-Type': 'application/x-www-form-urlencoded'},
                 "data": "url=" + fu
            }).success(function(data) {
                $scope.result = data;
            });
        }
    }]
);

feedhoosControllers.controller("RatingCtrl", ["$scope", "$http", "$cookies", 
    function($scope, $http, $cookies) {
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
        };

        $scope.$watch("rating", function(new_rating, old_rating) {
            if (new_rating == old_rating) {
                return;
            }
            var csrftoken = $cookies.csrftoken;
            $http({
                 "url": "/bookmark/rating/",
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {"Content-Type": "application/x-www-form-urlencoded"},
                 "data": ("feed_id=" + $scope.feed_id + "&rating=" + $scope.rating)
            }).success(function(data) {
                $scope.result = data;
            });
        });
    }]
)
.directive("setInitialRating", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs, ReaderCtrl) {
            scope.rating = scope.bookmark[attrs.feedId + ""].rating;
            scope.feed_id = attrs.feedId;
        },
    }
});

feedhoosControllers.config([
    function() {
    }
]);

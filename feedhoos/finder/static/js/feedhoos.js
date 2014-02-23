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

(function () {
    function baseManager() {
        this.set = function(scope, callback) {
            var that = this;
            scope.$on(this.message, function() {
                callback(scope, that);
            });
            if (this.data === null) {
                this.$http.get(this.url).success(function(data) {
                    that.data = data;
                    that.$rootScope.$broadcast(that.message);
                });
            }
            else {
                this.$rootScope.$broadcast(this.message);
            }
        };
        this.add = function(one) {
            if (this.data !== null) {
                this.data.push(one);
                this.$rootScope.$broadcast(this.message);
            }
        }
        this.sortByRating = function(data) {
            var that = this;
            var sort = function() {
                data.sort(
                    function(a, b) {
                        var a_rating,
                            b_rating;
                        a_rating = that.bookmarkManager.data[a.id + ""]["rating"]; 
                        b_rating = that.bookmarkManager.data[b.id + ""]["rating"]; 
                        if (a_rating < b_rating) {
                            return 1;
                        }
                        else if (a_rating > b_rating) {
                            return -1;
                        }
                        else {
                            return 0
                        }
                    }
                );
            }
            //FIXME
            while(this.bookmarkManager.data === null) {
            }
            sort();
            return data;
        }
    }

    function readingManager($http, $rootScope, bookmarkManager) {
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.bookmarkManager = bookmarkManager;
        this.data = null;
        this.message = "readings";
        this.url = "/reader/feed/reading/";
        this.remove = function(feed_id) {
            if (this.data !== null) {
                this.data = this.data.filter(function(f) {
                    return f.id != feed_id;
                });
                $rootScope.$broadcast(this.message);
            }
        }
    };
    readingManager.prototype = new baseManager();
    feedhoos.service("readingManager", ["$http", "$rootScope", "bookmarkManager", readingManager]);

    function feedManager($http, $rootScope, bookmarkManager){
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.bookmarkManager = bookmarkManager;
        this.data = null;
        this.message = "feeds";
        this.url = "/reader/feed/list/all/";
        this.remove = function(feed_id) {
            if (this.data !== null) {
                this.data = this.data.filter(function(f) {
                    return f.id != feed_id;
                });
                $rootScope.$broadcast(this.message);
            }
        }
    }
    feedManager.prototype = new baseManager();
    feedhoos.service("feedManager", ["$http", "$rootScope", "bookmarkManager", feedManager]);

    function bookmarkManager($http, $rootScope){
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.data = null;
        this.message = "bookmark";
        this.url = "/bookmark/list/";
        this.remove = function(feed_id) {
            if (this.data !== null) {
                delete this.data[feed_id + ""]
                $rootScope.$broadcast(this.message);
            }
        }
        this.add = function(feed_id) {
            feed_id = feed_id + "";
            if (this.data !== null) {
                this.data[feed_id] = {"rating": 0}
                $rootScope.$broadcast(this.message);
            }
        }
        this.set_rating = function(feed_id, rating) {
            feed_id = feed_id + "";
            if (this.data !== null && feed_id in this.data) {
                this.data[feed_id]["rating"] = rating;
                $rootScope.$broadcast(this.message);
            }
        }
    }
    bookmarkManager.prototype = new baseManager();
    feedhoos.service("bookmarkManager", ["$http", "$rootScope", bookmarkManager]);
}());

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
    ["$scope", "$routeParams", "$http", "uiSetter", "readingManager", "feedManager", "bookmarkManager", 
    function($scope, $routeParams, $http, uiSetter, readingManager, feedManager, bookmarkManager) {
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
        bookmarkManager.set($scope, function() {}); 
        feedManager.set($scope, function(scope, that) {
            scope.feeds = that.sortByRating(that.data);
        });
        readingManager.set($scope, function(scope, that) {
            scope.readings = that.sortByRating(that.data);
        })
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
            //FIXME
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


feedhoosControllers.controller("ListCtrl", ["$scope", "$http", "$cookies", "feedManager", "bookmarkManager",
    "feedManager", "readingManager",
    function($scope, $http, $cookies, feedManager, bookmarkManager, feedManager, readingManager) {
        feedManager.set($scope, function(scope, that) {
            //「登録されているすべてのfeedを除外
            scope.feeds = that.data.filter(function(f) {return f.id != 0});
        });
        bookmarkManager.set($scope, function(scope, that) {
            scope.bookmark = that.data;
        });
        $scope.remove = function(feed_id) {
            bookmarkManager.remove(feed_id);
            feedManager.remove(feed_id);
            readingManager.remove(feed_id);
            var csrftoken = $cookies.csrftoken;
            $http({
                 "url": "/reader/feed/list/delete/",
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {'Content-Type': 'application/x-www-form-urlencoded'},
                 "data": "feed_id=" + feed_id
            }).success(function(data) {
                //FIXME
            });
        }
    }]
);

feedhoosControllers.controller("FinderCtrl", ["$scope", "$http", "$cookies", "feedManager", "readingManager", "bookmarkManager",
    function($scope, $http, $cookies, feedManager, readingManager, bookmarkManager) {
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
                if (data.msg === "ok") {
                    $scope.result = data;
                    feedManager.add(data.feed);
                    readingManager.add(data.reading);
                    bookmarkManager.add(data.feed.id);
                }
            });
        }
    }]
);

feedhoosControllers.controller("RatingCtrl", ["$scope", "$http", "$cookies", "bookmarkManager", 
    function($scope, $http, $cookies, bookmarkManager) {
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
        };

        $scope.$watch("rating", function(new_rating, old_rating) {
            if (new_rating == old_rating) {
                return;
            }
            bookmarkManager.set_rating($scope.feed_id, new_rating);
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

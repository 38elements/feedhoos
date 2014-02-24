var feedhoos = angular.module("feedhoos", ["ngCookies", "ngRoute", 'ngSanitize', "ui.bootstrap", "feedhoosControllers"]);
feedhoos.factory("fhSetter", ["$route", "$window", function($route, $window){
    var fhSetter = {
        shortcut: function(event) {
            // j :74, k: 75
            if ($route.current.templateUrl !== "/static/partials/reader.html") {
                return
            }
            if (event.keyCode == 74 || event.keyCode == 75) {
                var content_bar_top = $window.document.getElementById("content_bar").getBoundingClientRect().top;
                var entries = $window.document.querySelectorAll(".panel-heading.entry_heading");
                entries = Array.prototype.slice.call(entries);
            }
            var margin = 10;
            var forward_standard_top = content_bar_top + margin;
            var back_standard_top = content_bar_top - margin;
            if (event.keyCode == 74) {
                for (var i = 0, max = entries.length; i < max; i++) {
                    var e = entries[i];
                    if (forward_standard_top < e.getBoundingClientRect().top) {
                        e.scrollIntoView();
                        return
                    }
                }
            }
            if (event.keyCode == 75) {
                entries.reverse();
                for (var i = 0, max = entries.length; i < max; i++) {
                    var e = entries[i];
                    if (back_standard_top > e.getBoundingClientRect().top) {
                        e.scrollIntoView();
                        return
                    }
                }
            }
        },
        resize: function() {
            var content_bar = $window.document.getElementById("content_bar");
            var feed_bar = $window.document.getElementById("feed_bar");
            try {
                var content_bar_top = content_bar.getBoundingClientRect().top 
                var feed_bar_top = feed_bar.getBoundingClientRect().top 
            } catch (e) {
                return
            }
            var innerHeight = $window.innerHeight;
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
    return fhSetter;
}]);

(function () {
    function baseManager() {
        this.set = function(scope, callback, is_reset) {
            var that = this;
            scope.$on(this.message, function() {
                callback(scope, that);
            });
            if (is_reset) {
                this.data = null;
            }
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

    function readingEntryManager($http, $rootScope){
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.data = null;
        this.store = {};
        this.message = "reading_entry";
        this.url = "";
        //feed_barに表示さえているfeedのタイプ  
        this.type = "feed";
        this.set_url = function(feed_id) {
            this.url = "/reader/feed/" + feed_id + "/page/1/";
        }
        this.read_feed = function(scope, feed_id) {
            feed_id = feed_id + "";
            if (scope._feed_id == feed_id && scope.type == this.type) {
                return;
            }
            scope._feed_id = feed_id;
            scope.type = this.type;
            scope.active_feed_id = feed_id;
            this.set_url(feed_id);
            if (feed_id in this.store) {
                var data = this.store[feed_id];
                scope.feed = data.feed;
                scope.entries = data.entries;
                return
            }
            else {
                this.set(scope, function(scope, that) {
                    // Listctrlでfeedを削除してもentryを削除してはいけない。
                    if (!(feed_id in that.store)) {
                        scope.feed = that.data.feed;
                        scope.entries = that.data.entries;
                        that.store[feed_id] = that.data;
                    }
                }, true);
                scope.readings.map(function(feed){
                    if (feed.id == feed_id) {
                        feed.unread_count = 0;
                    }
                });
            }
        }
    }
    readingEntryManager.prototype = new baseManager();
    feedhoos.service("readingEntryManager", ["$http", "$rootScope", readingEntryManager]);
}());

feedhoos.config(["$routeProvider",
    function($routeProvider, $rootScope) {
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

feedhoos.run(["$rootScope", "$window", "$document", "fhSetter",
    function($rootScope, $window, $document,  fhSetter) {
        $rootScope.feedhoos = {}
        $window.addEventListener("resize", fhSetter.resize, false);
        $document.bind("keyup", fhSetter.shortcut);
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
    ["$scope", "$routeParams", "$http", "fhSetter", "readingManager", "feedManager", "bookmarkManager", "readingEntryManager", 
    function($scope, $routeParams, $http, fhSetter, readingManager, feedManager, bookmarkManager, readingEntryManager) {
        $scope.fhSetter = fhSetter;
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
        });
        $scope.read_timeline = function(feed_id) {
            if ($scope._feed_id == feed_id && $scope.type == "timeline") {
                return;
            }
            $scope._feed_id = feed_id;
            $scope.type = "timeline";
            $scope.active_timeline_id = feed_id;
            var timeline_url = fhSetter.timeline_url(feed_id);
            $http.get(timeline_url).success(function(data) {
                $scope.feed = data.feed;
                $scope.entries = data.entries;
            });
        }
        $scope.read_feed = function(feed_id) {
            readingEntryManager.read_feed($scope, feed_id);
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
})
.directive("fhSetterResize", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs, ReaderCtrl) {
            scope.fhSetter.resize();
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

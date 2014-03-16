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
            if (content_bar && feed_bar) {
                var content_bar_top = content_bar.getBoundingClientRect().top 
                var feed_bar_top = feed_bar.getBoundingClientRect().top 
                var feed_bar_inner_elem = $window.document.querySelector(".tabbable.ng-isolate-scope");
                var innerHeight = $window.innerHeight;
                content_bar.style.height = innerHeight - content_bar_top + "px";
                feed_bar.style.height = innerHeight - feed_bar_top + "px";
                if (feed_bar_inner_elem) {
                    feed_bar_inner_elem.style.minHeight = innerHeight - feed_bar_top + 1 + "px";
                }
            }
        }
    };
    return fhSetter;
}]);

(function () {
    function baseManager($rootScope) {
        this.set = function(scope, callback, message, is_reset) {
            var that = this;
            message = message || this.message; 
            scope.$on(message, function() {
                callback(scope, that);
            });
            if (is_reset) {
                this.data = null;
            }
            if (this.data === null) {
                this.$http.get(this.url).success(function(data) {
                    that.data = data;
                    $rootScope.$broadcast(message);
                });
            }
            else {
                $rootScope.$broadcast(message);
            }
        };
        this.wait = function(timeout, time, predict_func, callback) {
            if (predict_func()) {
                var that = this;
                var _wait = function() {
                    that.wait(timeout, time, predict_func, callback); 
                }
                timeout(_wait, time);
            }
            else {
                callback();
            }
        }
    }
    feedhoos.service("baseManager", ["$rootScope", baseManager]);


    function baseFeedManager($rootScope, baseManager) {
        angular.extend(this, baseManager);
        this.add = function(one) {
            if (this.data !== null) {
                this.data.push(one);
                $rootScope.$broadcast(this.message);
            }
        }
        this.remove = function(feed_id) {
            if (this.data !== null) {
                this.data = this.data.filter(function(f) {
                    return f.id != feed_id;
                });
                $rootScope.$broadcast(this.message);
            }
        }
        this.sortByRating = function(data) {
            var that = this;
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
            return data;
        }
    };
    feedhoos.service("baseFeedManager", ["$rootScope", "baseManager", baseFeedManager]);


    function readingManager($http, bookmarkManager, baseFeedManager) {
        angular.extend(this, baseFeedManager);
        this.$http = $http;
        this.bookmarkManager = bookmarkManager;
        this.data = null;
        this.message = "readings";
        this.url = "/reader/feed/reading/";
    };
    feedhoos.service("readingManager", ["$http", "bookmarkManager", "baseFeedManager", readingManager]);


    function timelineManager($http, bookmarkManager, baseFeedManager){
        angular.extend(this, baseFeedManager);
        this.$http = $http;
        this.bookmarkManager = bookmarkManager;
        this.data = null;
        this.message = "feeds";
        this.url = "/reader/feed/list/all/";
        this.get_data_by_folder_id = function(folder_id) {
            var feed_ids = this.bookmarkManager.get_feed_ids_by_folder_id(folder_id);
            var data = this.data.filter(function(d) {
                return feed_ids.indexOf(d.id) > -1;
            });
            return data;
        }
    }
    timelineManager.prototype = new baseFeedManager();
    feedhoos.service("timelineManager", ["$http", "bookmarkManager", "baseFeedManager", timelineManager]);


    function folderManager($http, bookmarkManager, baseFeedManager){
        angular.extend(this, baseFeedManager);
        var that = this;
        this.$http = $http;
        this.data = null;
        this.message = "folder";
        this.url = "/folder/list/";
        this.create_url = "/folder/create/";
        this.default = {"id": 0, "title": "---", "rating": 6, "type": "folder"};
        this.get_title = function(folder_id) {
            //FIXME 高速化
            folder_id = folder_id - 0;
            if (this.default.id === folder_id) {
                return this.default.title;
            }
            var target_folder = this.data.filter(function(d) {return d.id === folder_id});
            if (target_folder.length > 0) {
                return target_folder[0].title;
            }
            throw new Error("No folder title.");
        }
        this.get_title_by_feed_id = function(feed_id) {
            var folder_id = bookmarkManager.get_folder_id(feed_id);
            return this.get_title(folder_id)
        }
        this.create = function(title, scope, callback) {
            if (!title) {
                callback(scope, that);
                return
            }
            var that = this;
            this.$http({
                 "url": this.create_url,
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {"Content-Type": "application/x-www-form-urlencoded"},
                 "data": "title=" + encodeURIComponent(title)
            }).success(function(data) {
                //folderのデータを追加する処理
                that.data.push(data);
                callback(scope, that);
            });
        };
        this.sortByRating = function() {
            this.data = this.data.sort(
                function(a, b) {
                    if (a.rating < b.rating) {
                        return 1;
                    }
                    else if (a.rating > b.rating) {
                        return -1;
                    }
                    else {
                        return 0
                    }
                }
            );
            return this.data;
        }
    }
    feedhoos.service("folderManager", ["$http", "bookmarkManager", "baseFeedManager",  folderManager]);


    function bookmarkManager($http, $rootScope, baseManager){
        angular.extend(this, baseManager);
        this.$http = $http;
        this.data = null;
        this.message = "bookmark";
        this.url = "/bookmark/list/";
        this.folder_url = "/bookmark/folder/";
        this.remove = function(feed_id) {
            if (this.data !== null) {
                delete this.data[feed_id + ""]
                $rootScope.$broadcast(this.message);
            }
        }
        this.add = function(feed_id) {
            feed_id = feed_id + "";
            if (this.data !== null) {
                this.data[feed_id] = {"rating": 0, "folder_id": 0}
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
        this.set_folder_id = function(feed_id, folder_id) {
            feed_id = feed_id + "";
            if (this.data !== null && feed_id in this.data) {
                this.data[feed_id]["folder_id"] = folder_id;
                $rootScope.$broadcast(this.message);
                this._send_folder_id(feed_id, folder_id);
            }
        }
        this._send_folder_id = function(feed_id, folder_id) {
            var that = this;
            this.$http({
                 "url": this.folder_url,
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {"Content-Type": "application/x-www-form-urlencoded"},
                 "data": "feed_id=" + encodeURIComponent(feed_id) + "&folder_id=" + encodeURIComponent(folder_id) 
            }).success(function(data) {
            });
        };
        this.get_folder_id = function(feed_id) {
            return this.data[feed_id + ""].folder_id;
        }
        this.get_feed_ids_by_folder_id = function(folder_id) {
            folder_id = folder_id - 0;
            var feed_ids = Object.keys(this.data).map(function(id) {return id - 0})
            if (folder_id === 0) {
                //「登録されているすべてのfeed」を除外
                return feed_ids.filter(function(id) {return id > 0;});
            }
            return feed_ids.filter(function(id) { return this.data[id + ""].folder_id === folder_id  }, this);
        }
        this.remove_folder = function(folder_id) {
            folder_id = folder_id - 0;
            Object.keys(this.data).map(
                function(key) {
                    var d = this.data[key];
                    d.folder_id = d.folder_id === folder_id ? 0 : folder_id; 
                }
            );
            $rootScope.$broadcast(this.message);
        }
    }
    feedhoos.service("bookmarkManager", ["$http", "$rootScope", "baseManager", bookmarkManager]);

    
    function baseEntryManager(baseManager) {
        angular.extend(this, baseManager);
        this.read_feed = function(scope, feed_id) {
            feed_id = feed_id + "";
            if (scope._feed_id == feed_id && scope.type == this.type) {
                return;
            }
            scope._feed_id = feed_id;
            scope.type = this.type;
            this.set_url(feed_id);
            if (feed_id in this.store) {
                var data = this.store[feed_id];
                scope.feed = data.feed;
                scope.entries = data.entries;
                return
            }
            else {
                this.set(scope, function(scope, that) {
                        if (scope._feed_id == feed_id && scope.type == that.type) {
                            scope.feed = that.data.feed;
                            scope.entries = that.data.entries;
                        }
                        if (feed_id == that.data.feed.id) {
                            that.store[feed_id] = that.data;
                        }
                    },
                    (this.message + feed_id),
                    true
                );
                if (this.type == "feed") {
                    scope.readings.map(function(feed){
                        if (feed.id == feed_id) {
                            feed.unread_count = 0;
                        }
                    });
                }
            }
        }
    }
    feedhoos.service("baseEntryManager", ["baseManager", baseEntryManager]);


    function readingEntryManager($http, baseEntryManager){
        angular.extend(this, baseEntryManager);
        this.$http = $http;
        this.data = null;
        this.store = {};
        this.message = "reading_entry";
        this.url = "";
        //feed_barに表示さえているfeedのタイプ  
        this.type = "feed";
        this.set_url = function(feed_id) {
            this.url = "/reader/feed/" + feed_id + "/page/1/";
        }
    }
    feedhoos.service("readingEntryManager", ["$http", "baseEntryManager", readingEntryManager]);


    function timelineEntryManager($http, baseEntryManager){
        angular.extend(this, baseEntryManager);
        this.$http = $http;
        this.data = null;
        this.store = {};
        this.message = "timeline_entry";
        this.url = "";
        //feed_barに表示さえているfeedのタイプ  
        this.type = "timeline";
        this.set_url = function(feed_id) {
            this.url = "/reader/feed/timeline/" + feed_id + "/page/1/";
        }
    }
    feedhoos.service("timelineEntryManager", ["$http", "baseEntryManager", timelineEntryManager]);
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
feedhoosControllers.config([
    function() {
    }
]);

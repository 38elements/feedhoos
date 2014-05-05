feedhoosControllers.controller(
    "ReaderCtrl",
    ["$scope", "$routeParams", "$http", "$timeout", "readingManager", "timelineManager", "bookmarkManager", "readingEntryManager", "timelineEntryManager", "folderManager", "folderEntryManager", 
    function($scope, $routeParams, $http, $timeout, readingManager, timelineManager, bookmarkManager, readingEntryManager, timelineEntryManager, folderManager, folderEntryManager) {
        $scope.type = "";
        //現在選択されているfeedのid
        $scope._feed_id = null;
        $scope.feed = null;
        $scope.folders = null;
        $scope.entries = null;
        $scope.feeds = [];
        $scope.bookmark = null;
        $scope.active_reading_id = -1;
        $scope.active_timeline_id = -1;
        $scope.feed_tab = true;
        $scope.timeline_tab = true;
        var predict_func = function() {
            return $scope.bookmark === null || $scope.folders === null;
        }
        bookmarkManager.set($scope, function(scope, that) {
            scope.bookmark = that.data;
        }); 
        folderManager.set($scope, function(scope, that) {
            scope.folders = that.data;
        }); 
        timelineManager.set($scope, function(scope, that) {
            that.wait($timeout, 25, predict_func, function() {
                var feeds = [];
                var timelines = that.attachRating(); 
                Array.prototype.push.apply(feeds, timelines);
                Array.prototype.push.apply(feeds, scope.folders);
                scope.feeds = feeds;
            });
        });
        readingManager.set($scope, function(scope, that) {
            that.wait($timeout, 25, predict_func,  function() {
                scope.readings = that.attachRating();
            });
        });
        $scope.read_timeline = function(feed_id, type) {
            $scope.active_timeline_id = feed_id;
            if (type == "feed") {
                timelineEntryManager.read_feed($scope, feed_id, type);
            }
            else if (type == "folder") {
                folderEntryManager.read_feed($scope, feed_id, type);
            }
        }
        $scope.read_reading = function(feed_id, type) {
            $scope.active_reading_id = feed_id;
            readingEntryManager.read_feed($scope, feed_id, type);
        }
    }]
);

feedhoosControllers.controller(
    "ReaderCtrl",
    ["$scope", "$routeParams", "$http", "$timeout", "readingManager", "timelineManager", "bookmarkManager", "readingEntryManager", "timelineEntryManager", 
    function($scope, $routeParams, $http, $timeout, readingManager, timelineManager, bookmarkManager, readingEntryManager, timelineEntryManager) {
        $scope.type = "";
        //現在選択されているfeedのid
        $scope._feed_id = null;
        $scope.feed = null;
        $scope.entries = null;
        $scope.feeds = [];
        $scope.bookmark = null;
        $scope.active_reading_id = -1;
        $scope.active_timeline_id = -1;
        $scope.feed_tab = true;
        $scope.timeline_tab = true;
        var predict_func = function() {
            return $scope.bookmark === null;
        }
        bookmarkManager.set($scope, function(scope, that) {
            scope.bookmark = that.data;
        }); 
        timelineManager.set($scope, function(scope, that) {
            that.wait($timeout, 25, predict_func, function() {
                scope.feeds = that.sortByRating(that.data)
            });
        });
        readingManager.set($scope, function(scope, that) {
            that.wait($timeout, 25, predict_func,  function() {
                scope.readings = that.sortByRating(that.data)
            });
        });
        $scope.read_timeline = function(feed_id) {
            $scope.active_timeline_id = feed_id;
            timelineEntryManager.read_feed($scope, feed_id);
        }
        $scope.read_reading = function(feed_id) {
            $scope.active_reading_id = feed_id;
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
});

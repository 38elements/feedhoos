feedhoosControllers.controller("ListCtrl", ["$scope", "$http", "$cookies",  "bookmarkManager",
    "timelineManager", "readingManager",
    function($scope, $http, $cookies, bookmarkManager, timelineManager, readingManager) {
        bookmarkManager.set($scope, function(scope, that) {
            scope.bookmark = that.data;
        });
        timelineManager.set($scope, function(scope, that) {
            //「登録されているすべてのfeedを除外
            var feeds = that.data.filter(function(f) {return f.id != 0});
            scope.feeds = that.sortByRating(feeds);
        });
    }]
);

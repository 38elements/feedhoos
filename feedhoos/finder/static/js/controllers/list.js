feedhoosControllers.controller("ListCtrl", ["$scope", "$http", "$cookies",  "bookmarkManager",
    "timelineManager", "fhSetter",
    function($scope, $http, $cookies, bookmarkManager, timelineManager, fhSetter) {
        $scope.fhSetter = fhSetter;
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

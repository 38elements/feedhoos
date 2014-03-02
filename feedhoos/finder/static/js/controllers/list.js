feedhoosControllers.controller("ListCtrl", ["$scope", "$http", "$cookies",  "bookmarkManager",
    "timelineManager",
    function($scope, $http, $cookies, bookmarkManager, timelineManager) {
        $scope.is_add_folder = true;
        $scope.create_folder = function() {
            console.log($scope.folder_name);
        }
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

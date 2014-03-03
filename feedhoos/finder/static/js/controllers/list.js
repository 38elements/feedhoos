feedhoosControllers.controller("ListCtrl", ["$scope", "$http", "$cookies",  "bookmarkManager",
    "timelineManager",
    function($scope, $http, $cookies, bookmarkManager, timelineManager) {
        $scope.is_add_folder = true;
        $scope.active_folder_id = 0;
        $scope.select_folder = function(folder_id) {
            console.log(folder_id);
        };
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

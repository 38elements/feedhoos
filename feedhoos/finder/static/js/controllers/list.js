feedhoosControllers.controller("ListCtrl", ["$scope", "$timeout",  "bookmarkManager",
    "timelineManager", "folderManager",
    function($scope, $timeout, bookmarkManager, timelineManager, folderManager) {
        $scope.is_add_folder = true;
        $scope.active_folder_id = 0;
        $scope.is_ready = function() {
            return $scope.bookmark !== undefined && $scope.feeds !== undefined && $scope.folders !== undefined
        }
        $scope.select_folder = function(folder_id) {
           folder_id = folder_id - 0;
           $scope.active_folder_id = folder_id;
           var feeds = timelineManager.get_data_by_folder_id(folder_id);
           $scope.feeds = timelineManager.sortByRating(feeds);
        };
        folderManager.set($scope, function(scope, that) {
            scope.folders = that.data;
        }); 
        bookmarkManager.set($scope, function(scope, that) {
            scope.bookmark = that.data;
        });
        timelineManager.set($scope, function(scope, that) {
            var predict_func = function() {
                return scope.bookmark === undefined;
            }
            //「登録されているすべてのfeedを除外
            var feeds = that.data.filter(function(f) {return f.id != 0});
            that.wait($timeout, 25, predict_func,  function() {
                scope.feeds = that.sortByRating(feeds);
            });
        });
    }]
);

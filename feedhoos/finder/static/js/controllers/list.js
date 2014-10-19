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
           timelineManager.attachRating();
           $scope.feeds = timelineManager.get_data_by_folder_id(folder_id);
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
            that.wait($timeout, 25, predict_func,  function() {
                //「登録されているすべてのfeed」を除外
                scope.feeds = that.attachRating().filter(function(f) {return f.id != 0});
            });
        });
    }]
);

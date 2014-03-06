feedhoosControllers.controller("ListCtrl", ["$scope", "$http", "$cookies", "$timeout",  "bookmarkManager",
    "timelineManager", "folderManager",
    function($scope, $http, $cookies, $timeout, bookmarkManager, timelineManager, folderManager) {
        $scope.is_add_folder = true;
        $scope.active_folder_id = 0;
        $scope.select_folder = function(folder_id) {
            console.log(folder_id);
        };
        $scope.create_folder = function() {
            folderManager.create($scope.folder_name);
        }
        folderManager.set($scope, function(scope, that) {
            scope.folders = that.data;
        }); 
        bookmarkManager.set($scope, function(scope, that) {
            scope.bookmark = that.data;
        });
        timelineManager.set($scope, function(scope, that) {
            var predict_func = function() {
                return scope.bookmark === null;
            }
            //「登録されているすべてのfeedを除外
            var feeds = that.data.filter(function(f) {return f.id != 0});
            that.wait($timeout, 25, predict_func,  function() {
                scope.feeds = that.sortByRating(feeds);
            });
        });
    }]
);

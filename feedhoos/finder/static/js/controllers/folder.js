feedhoosControllers.controller("FolderCtrl", ["$scope", "$timeout", "folderManager",
    function($scope, $timeout, folderManager) {
        $scope.is_ready = function() {
            return $scope.folders !== undefined;
        }
        folderManager.set($scope, function(scope, that) {
            scope.folders = that.data;
        }); 
    }]
);

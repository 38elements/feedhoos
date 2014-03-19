feedhoosControllers.controller("FolderCtrl", ["$scope", "$timeout", "folderManager",
    function($scope, $timeout, folderManager) {
        folderManager.set($scope, function(scope, that) {
            scope.folders = that.data;
        }); 
    }]
);

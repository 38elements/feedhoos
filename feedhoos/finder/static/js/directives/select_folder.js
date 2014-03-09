feedhoos.controller("SelectFolderCtrl", ["$scope", "folderManager", "bookmarkManager", 
    function($scope, folderManager, bookmarkManager) {
        $scope.current_name = folderManager.get_name($scope.folder_id);
        $scope.folders = folderManager.sortByRating();
        $scope.select = function(folder_id) {
            $scope.current_name = folderManager.get_name(folder_id);
            $scope.folder_id = folder_id;
            bookmarkManager.set_folder_id(this.feed_id, folder_id);
        }
    }]
);

feedhoos.directive("fhSelectFolder", function() {
    return {
        replace: true,
        restrict: "E",
        scope: {
            feed_id: "@feedId",
            folder_id: "@folderId",
        }, 
        controller: "SelectFolderCtrl",
        link: function(scope, element, attrs, controller) {
        },
        template: '' +
                '<span class="dropdown">' +
                    '<a class="dropdown-toggle">' +
                        '{{ current_name }}&nbsp;<span class="caret"></span>' +
                    '</a>' +
                    '<ul class="dropdown-menu">' +
                        '<li ng-repeat="f in folders">' +
                            '<a ng-click="select(f.id)">{{ f.name }}</a>' +
                        '</li>' +
                    '</ul>' +
                '</span>'
    }
});

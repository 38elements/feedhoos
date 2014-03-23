feedhoos.controller("SelectFolderCtrl", ["$scope", "folderManager", "bookmarkManager", "folderEntryManager", 
    function($scope, folderManager, bookmarkManager, folderEntryManager) {
        $scope.folders =[folderManager.default];
        Array.prototype.push.apply(
            $scope.folders,
            folderManager.sortByRating()
        );
        $scope.folderManager = folderManager;
        $scope.select = function(folder_id) {
            var prev_folder_id = bookmarkManager.get_folder_id(this.feed_id);
            folderEntryManager.remove(prev_folder_id);
            $scope.current_title = folderManager.get_title(folder_id);
            $scope.folder_id = folder_id;
            bookmarkManager.set_folder_id(this.feed_id, folder_id);
            folderEntryManager.remove(folder_id);
        }
    }]
);

feedhoos.directive("fhSelectFolder", function() {
    return {
        replace: true,
        restrict: "E",
        scope: {
            feed_id: "@feedId",
        }, 
        controller: "SelectFolderCtrl",
        link: function(scope, element, attrs, controller) {
            scope.current_title = scope.folderManager.get_title_by_feed_id(scope.feed_id);
        },
        template: '' +
                '<span class="dropdown">' +
                    '<a class="dropdown-toggle">' +
                        '{{ current_title }}&nbsp;<span class="caret"></span>' +
                    '</a>' +
                    '<ul class="dropdown-menu">' +
                        '<li ng-repeat="f in folders">' +
                            '<a ng-click="select(f.id)">{{ f.title }}</a>' +
                        '</li>' +
                    '</ul>' +
                '</span>'
    }
});

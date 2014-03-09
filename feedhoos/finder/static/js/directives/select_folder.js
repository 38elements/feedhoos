feedhoos.controller("SelectFolderCtrl", ["$scope", "folderManager", 
    function($scope, folderManager) {
        $scope.current_name = folderManager.get_name($scope.folder_id);
        $scope.folders = folderManager.sortByRating();
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
                        '{{ current_name }}' +
                    '</a>' +
                    '<ul class="dropdown-menu">' +
                        '<li ng-repeat="f in folders">' +
                            '<a>{{ f.name }}</a>' +
                        '</li>' +
                    '</ul>' +
                '</span>'
    }
});

feedhoos.controller("CreateFolderCtrl", ["$scope", "folderManager", 
    function($scope, folderManager) {
        $scope.input_disabled = false;
        $scope.create_folder = function() {
            $scope.input_disabled = true;
            folderManager.create($scope.folder_name, $scope, function(scope, that) {
                scope.input_disabled = false;
            });
            $scope.folder_name = "";
        }
    }]
);

feedhoos.directive("fhCreateFolder", function() {
    return {
        replace: true,
        restrict: "E",
        scope: {size: "@size"}, 
        controller: "CreateFolderCtrl",
        link: function(scope, element, attrs, controller) {
        },
        template: '' +
            '<article>' +
                '<div class="input-group {{size}}">' +
                    '<input type="text" class="form-control" ng-model="folder_name" ng-disabled="input_disabled">' + 
                    '<span class="input-group-btn">'+
                        '<button ' +
                            'class="btn btn-default" type="button"' +
                            'ng-click="create_folder()" ng-disabled="!folder_name">add</button>' +
                    '</span>' + 
                '</div>' +
            '</article>'
    }
});

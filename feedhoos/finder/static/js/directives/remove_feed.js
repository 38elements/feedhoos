feedhoos.controller("RemoveFeedCtrl", ["$scope", "$http", "bookmarkManager",
    "timelineManager", "readingManager",
    function($scope, $http, timelineManager, bookmarkManager, readingManager) {
        $scope.remove = function() {
            var url = "";
            if ($scope.type === "feed") {
                bookmarkManager.remove($scope.target_id);
                timelineManager.remove($scope.target_id);
                readingManager.remove($scope.target_id);
                url = "/reader/feed/list/delete/";
            }
            else if ($scope.type === "folder") {
                folderManager.remove($scope.target_id);
                bookmarkManager.remove_folder($scope.target_id);
                url = "/reader/folder/delete/";
            }
            $http({
                 "url": url,
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {'Content-Type': 'application/x-www-form-urlencoded'},
                 "data": "id=" + $scope.target_id
            }).success(function(data) {
                //FIXME
            });
        }
    }]
);

feedhoos.directive("fhRemoveFeed", function() {
    return {
        replace: true,
        restrict: "E",
        scope: {
            target_id: "@targetId",
            type: "@type",
        }, 
        controller: "RemoveFeedCtrl",
        link: function(scope, element, attrs, controller) {
        },
        template: '<span class="glyphicon glyphicon-remove" ng-click="remove()"></span>'
    }
});

feedhoos.controller("RemoveFeedCtrl", ["$scope", "$http", "bookmarkManager",
    "timelineManager", "readingManager",
    function($scope, $http, timelineManager, bookmarkManager, readingManager) {
        $scope.remove = function() {
            var url = "";
            if ($scope.type === "feed") {
                bookmarkManager.remove($scope.feed_id);
                timelineManager.remove($scope.feed_id);
                readingManager.remove($scope.feed_id);
                url = "/reader/feed/list/delete/";
            }
            $http({
                 "url": url,
                 "method": "POST",
                 "xsrfHeaderName": "X-CSRFToken",
                 "xsrfCookieName": "csrftoken",
                 "headers": {'Content-Type': 'application/x-www-form-urlencoded'},
                 "data": "id=" + $scope.feed_id
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
            feed_id: "@feedId",
            type: "@type",
        }, 
        controller: "RemoveFeedCtrl",
        link: function(scope, element, attrs, controller) {
        },
        template: '<span class="glyphicon glyphicon-remove" ng-click="remove()"></span>'
    }
});

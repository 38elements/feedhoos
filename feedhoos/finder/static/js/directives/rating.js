feedhoos.controller("RatingCtrl", ["$scope", "$http", "bookmarkManager", 
    function($scope, $http, bookmarkManager) {
        $scope.max = 5;
        $scope.isReadonly = false;
        $scope.bookmark = null;
        bookmarkManager.set($scope, function(scope, that) {
            scope.bookmark = that.data;
        });
        $scope.watch_rating = function() {
            this.unwatch_rating = $scope.$watch("rating", function(new_rating, old_rating) {
                var url = "";
                if (new_rating == old_rating) {
                    return;
                }
                if ($scope.type == "feed") {
                    url = "/bookmark/rating/";
                    bookmarkManager.set_rating($scope.target_id, new_rating);
                }
                $http({
                     "url": url,
                     "method": "POST",
                     "xsrfHeaderName": "X-CSRFToken",
                     "xsrfCookieName": "csrftoken",
                     "headers": {"Content-Type": "application/x-www-form-urlencoded"},
                     "data": ("id=" + $scope.target_id + "&rating=" + $scope.rating)
                }).success(function(data) {
                    $scope.result = data;
                });
            });
        }
    }]
);

feedhoos.directive("fhRating", function() {
    return {
        replace: true,
        restrict: "E",
        scope: {
            type: "@type",
            target_id: "@targetId",
        }, 
        controller: "RatingCtrl",
        link: function(scope, element, attrs, controller) {
            scope.rating = scope.bookmark[attrs.targetId + ""].rating;
            scope.watch_rating();
            //readerでのratingの変更に対応するため
            scope.$watch(function() { 
                    return element.attr("target-id");
                },
                function (new_target_id, old_target_id) {
                    if (new_target_id != old_target_id) {
                        scope.unwatch_rating();
                        scope.rating = scope.bookmark[attrs.targetId + ""].rating;
                        scope.watch_rating();
                    }
                }
            );
        },
        template: '<span><span class="glyphicon glyphicon-arrow-left" ng-click="rating = 0"></span> <rating value="rating" max="max" readonly="false"></rating></span>'
    }
});

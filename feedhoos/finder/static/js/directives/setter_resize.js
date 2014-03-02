feedhoos.controller("fhSetterResizeCtrl", ["$scope", "fhSetter",
    function($scope, fhSetter) {
        $scope.fhSetter = fhSetter; 
    }]
);

feedhoos.directive("fhSetterResize", function() {
    return {
        restrict: "A",
        scope: {},
        controller: "fhSetterResizeCtrl",
        link: function(scope, element, attrs) {
            scope.fhSetter.resize();
        },
    }
});

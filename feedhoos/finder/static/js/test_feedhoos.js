var feedhoos = angular.module("feedhoos", ["ngMockE2E", "ngCookies", "ngRoute", 'ngSanitize', "ui.bootstrap", "feedhoosControllers"]);

feedhoos.run(["$rootScope", "$window", "$document","$httpBackend", "fhSetter",
    function($rootScope, $window, $document, $httpBackend, fhSetter) {
        $rootScope.feedhoos = {}

        $httpBackend.whenGET('/static/partials/reader.html').passThrough();
    }
]);

var feedhoosControllers = angular.module("feedhoosControllers", []);
feedhoosControllers.config([
    function() {
    }
]);

(function () {

    "use strict";

    var module = angular.module("theGallery", ["ngResource", "ngComponentRouter"]);
    module.config(function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });

    module.value("$routerRootComponent", "galleryApp");
}());
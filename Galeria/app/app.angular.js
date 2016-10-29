(function () {

    "use strict";

    var module = angular.module("theGallery", ["ngResource", "ngComponentRouter"]);

    module.value("$routerRootComponent", "galleryApp");
} ());
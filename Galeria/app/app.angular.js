(function () {

    "use strict";

    console.log("Creating angular module theGallery");
    var module = angular.module("theGallery", ["ngResource", "ngComponentRouter"]);

    console.log("Registering the $routerRootComponent for the galleryApp");
    module.value("$routerRootComponent", "galleryApp");
} ());
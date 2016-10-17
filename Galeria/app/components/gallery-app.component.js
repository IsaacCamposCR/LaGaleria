(function () {
    "use strict";

    var module = angular.module("theGallery");

    console.log("Defining galleryApp component...");
    module.component("galleryApp", {
        templateUrl: "/components/gallery-app.component.html",
        $routeConfig: [
            { path: "/cliente", component: "clientComponent", name: "Client" },
            { path: "/calculadora", component: "artCalculatorComponent", name: "ArtCalculator" },
            { path: "/**", redirectTo: ["ArtCalculator"] }
        ]
    });
} ());
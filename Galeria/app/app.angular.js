(function () {

    "use strict";

    console.log("Creating angular module theGallery");
    var module = angular.module("theGallery", ["ngResource", "ngComponentRouter"]);

    console.log("Registering the $routerRootComponent for the galleryApp");
    module.value("$routerRootComponent", "galleryApp");

    /*
    var galleryApp = angular.module('galleryApp', ["ngResource", "ngRoute"])
        .config(function ($routeProvider, $locationProvider) {
            console.log("Creating routes...");
            $routeProvider.when("/calculadora",
                {
                    templateUrl: "components/calculator/template.calculator.html",
                    controller: "CalculatorController"
                }
            );
            $routeProvider.when("/cliente",
                {
                    templateUrl: "components/client/template.newClient.html",
                    controller: "NewClientController"
                }
            );
            $routeProvider.otherwise("/calculadora");

            $locationProvider.html5Mode(true);
        });
        */
} ());
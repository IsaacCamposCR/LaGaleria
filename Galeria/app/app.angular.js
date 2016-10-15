"use strict";

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
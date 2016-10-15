"use strict";

var galleryApp = angular.module('galleryApp', ["ngResource", "ngRoute"])
    .config(function ($routeProvider, $locationProvider) {
        console.log("Creating routes...");
        $routeProvider.when("/calculadora",
            {
                templateUrl: "templates/app.template.calculator.html",
                controller: "CalculatorController"
            }
        );
        $routeProvider.when("/cliente",
            {
                templateUrl: "templates/app.template.newClient.html",
                controller: "NewClientController"
            }
        );
        $routeProvider.otherwise("/calculadora");

        $locationProvider.html5Mode(true);
    }); 
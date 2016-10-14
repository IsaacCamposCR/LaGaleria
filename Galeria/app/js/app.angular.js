"use strict";

var galleryApp = angular.module('galleryApp', ["ngResource", "ngRoute"])
    .config(function ($routeProvider, $locationProvider) {
        console.log("Creating routes...");
        $routeProvider.when("/calculator",
            {
                templateUrl: "templates/app.template.calculator.html",
                controller: "CalculatorController"
            });
        $locationProvider.html5Mode(true);
    });
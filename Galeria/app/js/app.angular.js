"use strict";

var galleryApp = angular.module('galleryApp', ["ngResource", "ngRoute"])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
    });
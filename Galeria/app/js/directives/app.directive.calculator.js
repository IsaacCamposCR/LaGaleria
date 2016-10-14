"use strict";

galleryApp.directive("calculator", function ($compile) {
    console.log("Registering calculator directive...");
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/templates/directives/app.template.directive.calculator.html",
        scope: {
            product: "=product"
        }
    };
});
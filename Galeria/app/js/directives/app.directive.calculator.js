"use strict";

galleryApp.directive("calculator", function ($compile) {
    console.log("Registering calculator directive...");
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/templates/directives/app.template.directive.calculator.html",
        scope: {
            product: "=product"
        },
        link: function (scope, element, attrs, controller) {
            scope.$watch("scope.product", function (newValue) {
                console.log(scope.product.base);
                console.log("Aloja");
                console.log(newValue);
            }, true);
        }
    };
});
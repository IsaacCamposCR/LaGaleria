"use strict";

galleryApp.directive("calculator", function ($compile) {
    console.log("Registering calculator directive...");
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/components/calculator/template.directive.calculator.html",
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
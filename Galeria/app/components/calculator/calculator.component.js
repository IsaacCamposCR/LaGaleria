(function () {

    "use strict";

    var module = angular.module("theGallery");

    console.log("Creating calculator component...");
    module.component("calculator", {
        templateUrl: "/components/calculator/calculator.component.html",
        controllerAs: "model",
        controller: [calculatorController],
        bindings: {
            product: "<",
            totals: "&"
        },
    });

    function calculatorController() {

        var model = this;

        model.$onInit = function () { };

        model.$onChanges = function () {
            model.totals();
        };

    }

} ());
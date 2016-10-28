(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("calculator", {
        templateUrl: "/components/calculator/calculator.component.html",
        controllerAs: "model",
        controller: [calculatorController],
        bindings: {
            product: "<",
            // Binds the totals function from the parent in order to update the totals in the parent.
            totals: "&"
        },
    });

    function calculatorController() {

        var model = this;

        model.$onInit = function () { };

        // Everytime an input changes in the calculator, the total function bound is executed.
        model.$onChanges = function () {
            model.totals();
        };

    }

} ());
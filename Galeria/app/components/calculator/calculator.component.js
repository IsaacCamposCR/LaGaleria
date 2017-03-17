(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("calculator", {
        templateUrl: "/components/calculator/calculator.component.html",
        controllerAs: "model",
        controller: ["arrayService", calculatorController],
        bindings: {
            product: "<",
            // Binds the totals function from the parent in order to update the totals in the parent.
            totals: "&"
        },
    });

    function calculatorController(arrayService) {

        var model = this;

        model.$onInit = function () {
            arrayService.islogged(model);
        };

        // Everytime an input changes in the calculator, the total function bound is executed.
        model.$onChanges = function () {
            model.totals();
        };

        model.validateInput = function () {

            // Gets the absolute value in order to remove leading zeros.
            model.product.base = !model.product.base ? '' : Math.abs(model.product.base);
            model.product.height = !model.product.height ? '' : Math.abs(model.product.height);
            model.product.refill = !model.product.refill ? '' : Math.abs(model.product.refill);
            model.product.cmPrice = !model.product.cmPrice ? '' : Math.abs(model.product.cmPrice);

            model.product.calculate();
            model.totals();
        };

        model.validateKeys = function ($event) {
            // Number keys.
            if (($event.keyCode < 48) || ($event.keyCode > 57)) {
                // Backspace and Delete keys.
                if ($event.keyCode !== 8 && $event.keyCode !== 46) {
                    $event.preventDefault();
                }
            }
        };

    }

} ());
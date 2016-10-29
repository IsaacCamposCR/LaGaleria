(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("artCalculatorComponent", {
        templateUrl: "/components/art-calculator/art-calculator.component.html",
        controllerAs: "model",
        //The calculatorService must be added as a literal string in order to remain when the js is minified.
        controller: ["calculatorService", artCalculatorController]
    });

    function artCalculatorController(calculatorService) {

        var model = this;

        model.$onInit = function () {
            // Creates the dropdown menu options for different art types.
            model.arts = ["Bastidor", "Corriente", "Oleo"];

            // Selects a default art type.
            model.selectedArt = "Bastidor";

            model.subtotal = 0;
            model.others = 0;
            model.productTotal = 0;

            // Updates the products array with the necessary calculators from the service, 
            // this will in turn, update the UI with multiple calculators.
            model.products = calculatorService.generateCalculators(model.selectedArt);
        };

        // Whenever a new type is selected the calculator set must be refreshed.
        model.renderCalculators = function () {
            model.products = calculatorService.generateCalculators(model.selectedArt);
        };

        model.totals = function () {
            model.subtotal = 0;
            model.others = 0;
            model.productTotal = 0;

            model.products.forEach(function(product){
                model.subtotal += product.total;
                model.others = model.subtotal * 0.1;
                model.productTotal = model.subtotal + model.others; 
            });
        };
    }

} ());
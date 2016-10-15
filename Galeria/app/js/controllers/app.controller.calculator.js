"use strict";

galleryApp.controller("CalculatorController",
    function CalculatorController($scope, calculator) {
        console.log("Registering calculator controller...");

        // Setting up the default selection.
        $scope.selectedCalculator = "Bastidor";

        // Setting up the types [TODO: Retrieve this from the database].
        $scope.calculators = ["Bastidor", "Corriente", "Oleo"];

        // Retrieve the default calculator set from the calculator service.
        $scope.products = calculator.generateCalculators($scope.selectedCalculator);

        // Whenever a new type is selected the calculator set must be refreshed.
        $scope.renderCalculators = function () {
            $scope.products = calculator.generateCalculators($scope.selectedCalculator);
        };
    }
);
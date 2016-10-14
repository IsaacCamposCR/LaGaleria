"use strict";

galleryApp.controller("CalculatorController",
    function CalculatorController($scope, calculator) {
        console.log("Registering calculator controller...");

        $scope.type = "Corriente";

        $scope.products = calculator.generateCalculators($scope.type);
    }
);
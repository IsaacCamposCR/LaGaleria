(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.factory("calculatorService", function () {
        console.log("Registering calculator service...");

        // Template for each calculator.
        var Product = function (name, cmPrice, refillRequired) {
            return {
                name: name,
                required: refillRequired,
                base: 0,
                height: 0,
                refill: 0,
                cmPrice: cmPrice,
                total: 0
            };
        };

        // Creates a new calculator: Bastidor con Tela.
        var calculateFrame = function () {

            var frame = Product("Bastidor", 30, false);
            frame.calculate = function () {
                frame.total = ((frame.base + frame.height) * 2) * frame.cmPrice;
            };

            var cloth = Product("Tela", 1.5, false);
            cloth.calculate = function () {
                cloth.total = (cloth.base * cloth.height) * cloth.cmPrice;
            };

            return [frame, cloth];
        };

        // Creates a new calculator: Corriente.
        var calculateNormal = function () {

            var molding = Product("Moldura", 50, true);
            molding.calculate = function () {
                molding.total = (((molding.base + molding.height) * 2) + molding.refill) * molding.cmPrice;
            };

            var cardboard = Product("Maria Luisa Carton", 4, false);
            cardboard.calculate = function () {
                cardboard.total = (cardboard.base * cardboard.height) * cardboard.cmPrice;
            };

            var edge = Product("Filo", 22, false);
            edge.calculate = function () {
                edge.total = ((edge.base + edge.height) * 2) * edge.cmPrice;
            };

            return [molding, cardboard, edge];
        };

        // Creates a new calculator: Oleo.
        var calculateOil = function () {

            var molding = Product("Moldura", 50, true);
            molding.calculate = function () {
                molding.total = (((molding.base + molding.height) * 2) + molding.refill) * molding.cmPrice;
            };

            var wood = Product("Maria Luisa Madera", 0, true);
            wood.calculate = function () {
                wood.total = (((wood.base + wood.height) * 2) + wood.refill) * wood.cmPrice;
            };

            var frame = Product("Bastidor", 30, false);
            frame.calculate = function () {
                frame.total = ((frame.base + frame.height) * 2) * frame.cmPrice;
            };

            return [molding, wood, frame];
        };

        return {
            // Controller will ask for a set of calculators determined by the type, 
            // these functions create the correct set of calculator forms.
            generateCalculators: function (type) {
                console.log("Generating calculators for " + type);
                switch (type) {
                    case "Bastidor":
                        return calculateFrame();
                    case "Corriente":
                        return calculateNormal();
                    case "Oleo":
                        return calculateOil();
                }
            }
        };
    });

} ());


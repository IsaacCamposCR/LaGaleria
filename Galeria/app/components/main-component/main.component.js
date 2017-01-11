(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("mainComponent", {
        templateUrl: "/components/main-component/main.component.html",
        controllerAs: "model",
        //The calculatorService must be added as a literal string in order to remain when the js is minified.
        controller: ["clientService", "reservationService", "arrayService", mainController],
        bindings: {
            "$router": "<"
        }
    });

    function mainController(clientService, reservationService, arrayService) {
        var model = this;

        model.$onInit = function () {
            model.nextOrders = [];
            getNextOrders();
        };

        var getNextOrders = function () {
            reservationService.next().$promise
                .then(function (result) {
                    // Iterates through every reservation to assign client names and article descriptions.
                    result.results.forEach(function (order) {
                        loadClientData(order);
                    });
                });
        };

        var loadClientData = function (order) {
            // Queries the client service for the client name.
            clientService.get(order.client).$promise
                .then(function (clientResult) {
                    order.client = clientResult.results.name;
                    arrayService.push(order, model.nextOrders);
                });
        };

        model.redirect = function (order) {
            model.$router.navigate(['ArtCalculator', { id: order._id }]);
        };
    }
} ());
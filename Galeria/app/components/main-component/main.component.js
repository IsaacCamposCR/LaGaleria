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
            model.pendingRemaining = [];
            getNextOrders();
            getPendingRemaining();
        };

        var getPendingRemaining = function () {
            reservationService.remaining().$promise
                .then(function (result) {
                    // Iterates through every reservation to assign client names and article descriptions.
                    result.results.forEach(function (reservation) {
                        if (reservation.orders && reservation.orders.length > 0) {
                            reservation.type = "Encargo";
                        }
                        else {
                            reservation.type = "Apartado";
                        }
                        loadClientData(reservation, model.pendingRemaining);
                    });
                });
        };

        var getNextOrders = function () {
            reservationService.next().$promise
                .then(function (result) {
                    // Iterates through every reservation to assign client names and article descriptions.
                    result.results.forEach(function (order) {
                        loadClientData(order, model.nextOrders);
                    });
                });
        };

        var loadClientData = function (order, array) {
            // Queries the client service for the client name.
            clientService.get(order.client).$promise
                .then(function (clientResult) {
                    order.client = clientResult.results.name;
                    arrayService.push(order, array);
                });
        };

        model.redirect = function (order) {
            if (order.type && order.type === "Apartado") {
                model.$router.navigate(['Reservation', { id: order._id }]);
            }
            else {
                model.$router.navigate(['ArtCalculator', { id: order._id }]);
            }

        };
    }
} ());
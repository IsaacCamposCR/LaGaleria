(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("reservationListComponent", {
        templateUrl: "/components/reservation-component/reservation-list/reservation-list.component.html",
        controllerAs: "model",
        controller: ["clientService", "inventoryService", "reservationService", "arrayService", reservationListController],
        bindings: {
            "$router": "<",
            "clientReservations": "<"
        }
    });

    function reservationListController(clientService, inventoryService, reservationService, arrayService) {
        var model = this;

        model.$onInit = function () {
            model.orderBy = "+date";
            // Initiates the reservation array as empty.
            model.reservations = [];

            // Queries the reservation service for all reservations.
            reservationService.list(model.clientReservations).$promise
                .then(function (result) {
                    if (result.results) {
                        // Iterates through every reservation to assign client names and article descriptions.
                        result.results.forEach(function (reservation) {
                            loadClientData(reservation);
                        });
                    }
                });
        };

        var loadClientData = function (reservation) {
            // Queries the client service for the client name.
            clientService.get(reservation.client).$promise
                .then(function (clientResult) {
                    reservation.client = clientResult.results.name;
                    // This is an async call, so the data has to be created as promises 
                    // are executed before populating the reservations array.
                    if (reservation.articles && reservation.articles.length > 0) {
                        if (reservation.advances && reservation.advances.length > 0) {
                            reservation.type = "Apartado";
                        }
                        else {
                            reservation.type = "Venta";
                            reservation.price = 0;
                        }
                        loadArticleData(reservation);
                    }
                    if (reservation.orders && reservation.orders.length > 0) {
                        reservation.type = "Encargo";
                        loadOrderData(reservation);
                    }
                });
        };

        var loadArticleData = function (reservation) {
            // A reservation can contain several articles, if there's more than one: print the amount of articles.
            if (reservation.articles.length > 1) {
                reservation.article = reservation.articles.length + " Articulos";
                // There aren't any more promises chained, so the reservation is pushed.
                arrayService.push(reservation, model.reservations);
            }
            // If the reservation contains only one article: print its name.
            else {
                // And in order to get the description, the inventory service must be queried.
                inventoryService.get(reservation.articles[0].article).$promise
                    .then(function (articleResult) {
                        reservation.article = articleResult.results.description;
                        // Here ends the promise chain, so the reservation is pushed.
                        arrayService.push(reservation, model.reservations);
                    });
            }
        };

        var loadOrderData = function (reservation) {
            // A reservation can contain several orders, if there's more than one: print the amount of orders.
            if (reservation.orders.length > 1) {
                reservation.order = reservation.orders.length + " Encargos";
            }
            // If the reservation contains only one order: print its type.
            else {
                reservation.order = reservation.orders[0].type;
            }
            // Here ends the promise chain, so the reservation is pushed.
            arrayService.push(reservation, model.reservations);
        };

        model.$onChanges = function () {
            if (model.clientReservations) {
                model.$onInit();
            }
        };

        model.redirect = function (reservation) {
            if (reservation.type === "Encargo") {
                model.$router.navigate(['ArtCalculator', { id: reservation._id }]);
            }
            else {
                model.$router.navigate(['EditReservation', { id: reservation._id }]);
            }
        };

        model.sort = function (column) {
            model.orderBy = arrayService.sort(model.orderBy, column);
        };

    }
} ());
(function() {
    "use strict";

    var module = angular.module("theGallery");

    module.component("reservationListComponent", {
        templateUrl: "/components/reservation-component/reservation-list/reservation-list.component.html",
        controllerAs: "model",
        controller: ["clientService", "inventoryService", "reservationService", reservationListController],
        bindings: {
            "$router": "<"
        }
    });

    function reservationListController(clientService, inventoryService, reservationService) {
        var model = this;

        model.$onInit = function() {
            // Initiates the reservation array as empty.
            model.reservations = [];

            // Queries the reservation service for all reservations.
            reservationService.list().$promise
                .then(function(result) {
                    // Iterates through every reservation to assign client names and article descriptions.
                    result.results.forEach(function(reservation) {
                        loadClientData(reservation);
                    });
                });
        };

        var loadClientData = function(reservation) {
            // Queries the client service for the client name.
            clientService.get(reservation.client).$promise
                .then(function(clientResult) {
                    reservation.client = clientResult.results.name;
                    // This is an async call, so the data has to be created as promises 
                    // are executed before populating the reservations array.
                    loadArticleData(reservation);
                });
        };

        var loadArticleData = function(reservation) {
            // A reservation can contain several articles, if there's more than one: print the amount of articles.
            if (reservation.articles.length > 1) {
                reservation.article = reservation.articles.length + " articulos";
                // There aren't any more promised chained, so the reservation is pushed.
                model.reservations.push(reservation);
            }
            // If the reservation contains only one article: print its name.
            else {
                // And in order to get the description, the inventory service must be queried.
                inventoryService.get(reservation.articles[0].article).$promise
                    .then(function(articleResult) {
                        reservation.article = articleResult.results.description;
                        // Here ends the promise chain, so the reservation is pushed.
                        model.reservations.push(reservation);
                    });
            }

        };

    }
} ());
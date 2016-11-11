(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.factory("reservationService", function ($resource) {

        var resource = $resource("/api/reservation/:id",
            { id: "@id" },
            {
                query: {
                    method: "GET",
                    isArray: false
                }
            });

        var saveReservation = function (reservation) {

            // Saves the data to the endpoint, asynchronous.
            return resource.save(reservation);
        };

        var listReservations = function () {

            // Returns a promise with a list of all reservations
            return resource.query();
        };

        return {
            save: saveReservation,
            list: listReservations
        };
    });
} ());
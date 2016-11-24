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

        var listReservations = function (id) {
            console.log("service",id);

            // Returns a promise with a list of all reservations
            return resource.query({ _id: id });
        };

        var getReservation = function (id) {

            // Returns a single reservation by id.
            return resource.get({ id: id });
        };

        return {
            save: saveReservation,
            list: listReservations,
            get: getReservation
        };
    });
} ());
(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("mainComponent", {
        templateUrl: "/components/main-component/main.component.html",
        controllerAs: "model",
        //The services must be added as a literal strings in order to remain when the js is minified.
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
                            setOrderClass(reservation);
                        }
                        else {
                            reservation.type = "Apartado";
                            setReservationClass(reservation);
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
                        setOrderClass(order);
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

        var setOrderClass = function (order) {
            order.class = "alert alert-success";
            order.status = "A Tiempo!";

            // Gets the Date Value from today and the order.
            var todayDate = new Date();
            var orderDate = new Date(order.delivery);

            // Converts to short date to remove time values and leave just day/month/year.
            var shortToday = todayDate.toLocaleDateString();
            var shortOrder = orderDate.toLocaleDateString();

            // Returns the short date to date format.
            todayDate = new Date(shortToday);
            orderDate = new Date(shortOrder);

            if (orderDate.getTime() < todayDate.getTime()) {
                order.class = "alert alert-danger";
                order.status = "Atrasado!";
            }

            if (orderDate.getTime() === todayDate.getTime()) {
                order.class = "alert alert-warning";
                order.status = "Entregar Hoy!";
            }
        };

        var setReservationClass = function (reservation) {
            reservation.class = "alert alert-danger";
            reservation.status = "Saldo Pendiente!";
        };
    }
} ());
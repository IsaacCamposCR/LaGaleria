(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("artCalculatorComponent", {
        templateUrl: "/components/art-calculator/art-calculator.component.html",
        controllerAs: "model",
        //The calculatorService must be added as a literal string in order to remain when the js is minified.
        controller: ["calculatorService", "reservationService", "arrayService", artCalculatorController],
        bindings: {
            "$router": "<"
        }
    });

    function artCalculatorController(calculatorService, reservationService, arrayService) {

        var model = this;

        var newOrder = function () {
            model.editingOrder = false;

            model.title = "Nuevo Encargo";

            // Enables the calculators.
            model.disableCalculators = true;

            // Creates the dropdown menu options for different art types.
            model.arts = ["Bastidor", "Corriente", "Oleo"];

            // Selects a default art type.
            model.selectedArt = "Bastidor";

            model.subtotal = 0;
            model.others = 0;
            model.productTotal = 0;

            // Updates the products array with the necessary calculators from the service, 
            // this will in turn, update the UI with multiple calculators.
            model.products = calculatorService.generateCalculators(model.selectedArt);
        };

        var loadOrder = function (id) {
            model.editingOrder = true;

            model.title = "Detalles del Encargo";

            model.specialPrice = true;

            //Disable the form when an existing reservation is loaded.
            model.disableForm = true;

            // Disables the calculators.
            model.disableCalculators = false;

            // Calls the reservation service for a reservation by id.
            reservationService.get(id).$promise
                .then(function (result) {
                    // Checks for errors
                    if (!arrayService.errors(model, result, "ReservationList")) {

                        model.id = result.results._id;
                        //model.invoice = result.results.invoice;
                        model.date = new Date(result.results.date);
                        model.price = result.results.price;
                        model.advances = result.results.advances;
                        model.orders = result.results.orders;

                        // Loads the client component.
                        model.clientId = result.results.client;

                        model.orderTotals();
                    }
                });
        };

        model.$routerOnActivate = function (next) {

            // Initiates an empty order array.
            model.orders = [];
            model.orderTotal = 0;
            model.price = 0;
            model.orderTotal = 0;
            model.advances = [];
            model.remaining = 0;
            model.details = "";
            model.date = new Date();

            if (next.params.id) {
                loadOrder(next.params.id);
            }
            else {
                newOrder();
            }
        };

        // Whenever a new type is selected the calculator set must be refreshed.
        model.renderCalculators = function () {
            model.products = calculatorService.generateCalculators(model.selectedArt);
        };

        model.totals = function () {
            model.subtotal = 0;
            model.others = 0;
            model.productTotal = 0;

            model.products.forEach(function (product) {
                model.subtotal += product.total;
                model.others = model.subtotal * 0.1;
                model.productTotal = model.subtotal + model.others;
            });
        };

        // This function calculates all the totals depending on the orders.
        model.CalculateTotals = function () {

            model.price = model.orderTotal;

            // Matches the remaining to that of the total price before substracting every advance.
            model.remaining = model.orderTotal;

            model.advances.forEach(function (order) {
                model.remaining -= order.amount;
            });
        };

        // This function calculates all the totals depending on the modified Final Price for the order.
        model.SpecialTotals = function () {

            // Matches the remaining to that of the total price before substracting every advance.
            model.remaining = arrayService.unformat(model.price);

            model.advances.forEach(function (advance) {
                model.remaining -= advance.amount;
            });
        };

        model.orderTotals = function () {
            model.orderTotal = 0;

            model.orders.forEach(function (order) {
                model.orderTotal += order.amount;
            });

            if (model.specialPrice) {
                model.SpecialTotals();
            }
            else {
                model.CalculateTotals();
            }
        };

        model.updatePrice = function () {
            model.specialPrice = true;
        };

        model.resetPrice = function () {
            model.specialPrice = false;
            model.price = model.orderTotal;
        };

        model.addOrder = function () {
            // Builds up a description string containing the order details.
            model.products.forEach(function (product) {
                model.details +=
                    "\n" + product.name +
                    ((product.base) ? ":\nAncho:" + product.base : "") +
                    ((product.height) ? "\nAlto:" + product.height : "") +
                    ((product.refill) ? "\nRefill:" + product.refill : "") +
                    "\n\n";
            });

            // Adds a new order with data from the calculators.
            model.orders.push({
                type: model.selectedArt,
                description: model.details,
                amount: model.productTotal,
                complete: false
            });

            // Cleans up every calculator data so that it can be reused.
            model.products.forEach(function (product) {
                product.base = "0";
                product.height = "0";
                product.refill = "0";
            });

            model.details = "";

            model.orderTotals();
        };

        model.deleteOrder = function (index) {
            model.orders.splice(index, 1);

            model.orderTotals();
        };

        model.finish = function () {
            if (model.clientId) {

                if (model.orders.length > 0) {

                    var reservation = {
                        _id: model.id,
                        client: model.clientId,
                        date: model.date,
                        delivery: model.delivery,
                        price: arrayService.unformat(((model.specialPrice) ? model.price : model.orderTotal)),
                        description: model.details,
                        advances: model.advances,
                        orders: model.orders
                    };

                    reservationService.save(reservation).$promise
                        .then(function (response) {
                            // Checks for errors...
                            if (!arrayService.errors(model, response, "ReservationList")) {

                                arrayService.pop("success",
                                    true,
                                    "El encargo se ha guardado con exito!",
                                    function () {
                                        model.$router.navigate(["ReservationList"]);
                                    },
                                    function () { },
                                    model);
                            }
                        })
                        .catch(function (response) {
                            console.log(response.errors);
                            arrayService.pop("error",
                                true,
                                "Ha ocurrido un error...",
                                function () {
                                    model.$router.navigate(["ReservationList"]);
                                },
                                function () { },
                                model);
                        });
                }
                else {
                    arrayService.pop("error",
                        true,
                        "Debe ingresar al menos una orden...",
                        function () {
                            model.disableForm = false;
                        },
                        function () { },
                        model);
                }
            }
            else {
                arrayService.pop("error",
                    true,
                    "No se ha seleccionado un cliente...",
                    function () {
                        model.disableForm = false;
                    },
                    function () { },
                    model);
            }
        };

        model.editOrder = function () {
            // Hides the EDIT button.
            model.editingOrder = false;

            // Enables the form.
            model.disableForm = false;
        };

        model.cancelOrder = function () {
            arrayService.pop("confirm",
                true,
                "Esta seguro que desea cancelar? Perdera los cambios.",
                // Sets the custom action to perform when canceling.
                function () {
                    model.$router.navigate(["ReservationList"]);
                },
                function () {
                    model.disableForm = model.editingReservation;
                },
                model);
        };
    }

} ());
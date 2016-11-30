(function() {

    "use strict";

    var module = angular.module("theGallery");

    module.component("artCalculatorComponent", {
        templateUrl: "/components/art-calculator/art-calculator.component.html",
        controllerAs: "model",
        //The calculatorService must be added as a literal string in order to remain when the js is minified.
        controller: ["calculatorService", "reservationService", artCalculatorController],
        bindings: {
            "$router": "<"
        }
    });

    function artCalculatorController(calculatorService, reservationService) {

        var model = this;

        var newOrder = function() {
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

        var loadOrder = function(id) {
            model.title = "Detalles del Encargo";

            //Disable the form when an existing reservation is loaded.
            model.disableForm = true;

            // Disables the calculators.
            model.disableCalculators = false;

            // Calls the reservation service for a reservation by id.
            reservationService.get(id).$promise
                .then(function(result) {
                    model.id = result.results._id;
                    //model.invoice = result.results.invoice;
                    model.date = new Date(result.results.date);
                    model.price = result.results.price;
                    model.advances = result.results.advances;
                    model.orders = result.results.orders;

                    // Loads the client component.
                    model.clientId = result.results.client;

                    model.orderTotals();
                });
        };

        model.$routerOnActivate = function(next) {

            // Initiates an empty order array.
            model.orders = [];
            model.orderTotal = 0;
            model.advances = [];
            model.remaining = 0;

            if (next.params.id) {
                loadOrder(next.params.id);
            }
            else {
                newOrder();
            }
        };

        // Whenever a new type is selected the calculator set must be refreshed.
        model.renderCalculators = function() {
            model.products = calculatorService.generateCalculators(model.selectedArt);
        };

        model.totals = function() {
            model.subtotal = 0;
            model.others = 0;
            model.productTotal = 0;

            model.products.forEach(function(product) {
                model.subtotal += product.total;
                model.others = model.subtotal * 0.1;
                model.productTotal = model.subtotal + model.others;
            });
        };

        model.orderTotals = function() {
            model.orderTotal = 0;

            model.orders.forEach(function(order) {
                model.orderTotal += order.amount;
            });

            // Matches the remaining to that of the total price before substracting every advance.
            model.remaining = model.orderTotal;

            model.advances.forEach(function(order) {
                model.remaining -= order.amount;
            });
        };

        model.addOrder = function() {
            // Builds up a description string containing the order details.
            var description = "";
            model.products.forEach(function(product) {
                description +=
                    product.name +
                    ":\nAncho:" + product.base +
                    "\nAlto:" + product.height +
                    "\nRefill:" + product.refill +
                    "\n\n";
            });
            model.description = description;

            // Adds a new order with data from the calculators.
            model.orders.push({
                type: model.selectedArt,
                description: model.description,
                amount: model.productTotal,
                complete: false
            });

            // Cleans up every calculator data so that it can be reused.
            model.products.forEach(function(product) {
                product.base = 0;
                product.height = 0;
                product.refill = 0;
            });

            model.orderTotals();
        };

        model.deleteOrder = function(index) {
            model.orders.splice(index, 1);

            model.orderTotals();
        };

        model.finish = function() {
            var reservation = {
                client: model.clientId,
                date: new Date(),
                price: model.orderTotal,
                description: model.description,
                advances: model.advances,
                orders: model.orders
            };

            reservationService.save(reservation).$promise
                .then(function(response) {
                    popUp("success",
                        true,
                        "El encargo se ha guardado con exito!",
                        function() {
                            model.$router.navigate(["ReservationList"]);
                        });
                })
                .catch(function(response) {
                    console.log(response.errors);
                    popUp("error",
                        true,
                        "Ha ocurrido un error...",
                        function() { });
                });
        };

        // Pop up message component. The model.pop property allows the form to hide the buttons when displaying the popup. 
        // This mechanism might not be required once styles are put in.
        var popUp = function(type, pop, message, confirm, cancel) {
            model.messageType = type;
            model.message = message;
            model.pop = pop;
            model.disableForm = true;
            model.confirm = confirm;
            if (cancel) {
                model.cancel = cancel;
            }
        };
    }

} ());
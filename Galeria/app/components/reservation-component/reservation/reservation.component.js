(function() {
    "use strict";

    var module = angular.module("theGallery");

    module.component("reservationComponent", {
        templateUrl: "/components/reservation-component/reservation/reservation.component.html",
        controllerAs: "model",
        controller: ["clientService", "inventoryService", "reservationService", "arrayService", reservationController],
        bindings: {
            "$router": "<"
        }
    });

    function reservationController(clientService, inventoryService, reservationService, arrayService) {
        var model = this;

        // Cleans up the form for a new reservation.
        var newReservation = function() {
            model.title = "Nuevo Apartado";

            // Form properties
            model.invoice = "";
            model.date = new Date();
            model.price = 0;
            model.remaining = 0;
            model.client = "";
        };

        var loadReservation = function(id) {
            model.title = "Detalles del Apartado";

            //Disable the form when an existing reservation is loaded.
            model.disableForm = true;

            // Enables the EDIT button.
            model.editingReservation = true;

            // Calls the reservation service for a reservation by id.
            reservationService.get(id).$promise
                .then(function(result) {
                    model.id = result.results._id;
                    model.invoice = result.results.invoice;
                    model.date = new Date(result.results.date);
                    model.price = result.results.price;
                    model.advances = result.results.advances;

                    // Calls the article service
                    for (var i = 0; i < result.results.articles.length; i++) {

                        // Because the client component is nested, angular is running initialization twice.
                        // This validation ensures the array will get created once per article.
                        if (model.articles.length < result.results.articles.length) {
                            // Creates the article array before querying mongo.
                            model.articles.push({
                                _id: result.results.articles[i].article,
                                quantity: result.results.articles[i].quantity
                            });
                        }

                        // Per each article from the reservation, query the inventory service to get the remaining data.
                        inventoryService.get(result.results.articles[i].article).$promise
                            .then(function(articleResult) {
                                // Adds missing data to already existing items in the article array.
                                var arrayArticle = arrayService.lookup(articleResult.results._id, model.articles)[0];
                                arrayArticle.description = articleResult.results.description;
                                arrayArticle.price = articleResult.results.price;
                                arrayArticle.max = articleResult.results.stock + arrayArticle.quantity;
                                arrayArticle.originalQuantity = arrayArticle.quantity;

                                model.displayTotals();
                            });
                    }

                    // Calls the client service for the client name.
                    model.clientId = result.results.client;
                });
        };

        model.$routerOnActivate = function(next) {

            // Lookup properties
            model.lookupClients = [];
            model.lookupArticles = [];

            model.articles = [];
            model.advances = [];

            // Takes the id from the parameters in the new url.
            if (next.params.id) {
                loadReservation(next.params.id);
            } else {
                newReservation();
            }
        };

        // When the user starts typing in the Client field, 
        // the search triggers to show matching results by name.
        model.beginClientSearch = function() {
            if (model.client !== "") {
                // Queries the client service for matching clients by name.
                clientService.find(model.client).$promise
                    .then(function(result) {
                        model.lookupClients = result.results;
                    });

                // Hides the search option for articles.
                model.endArticleSearch();
                // Shows the search option for clients.
                model.lookupClient = true;
            } else {
                // If the search box is empty do not show any search options.
                model.endClientSearch();
            }
        };

        // Disable search options for clients.
        model.endClientSearch = function() {
            model.lookupClient = false;
        };

        // When the user starts typing in the Article field, 
        // the search triggers to show matching results by name.
        model.beginArticleSearch = function() {
            if (model.article !== "") {
                // Queries the inventory service for matching articles by description.
                inventoryService.filter(model.article, true).$promise
                    .then(function(result) {
                        model.lookupArticles = result.results;
                    });

                // Hides the search option for clients.
                model.endClientSearch();
                // Shows the search option for articles.
                model.lookupArticle = true;
            } else {
                // If the search box is empty do not show any search options.
                model.endArticleSearch();
            }
        };

        // Disable search options for articles.
        model.endArticleSearch = function() {
            model.lookupArticle = false;
            model.article = "";
        };

        // Asigns a client when an option is clicked on the autocomplete search options.
        model.selectClient = function(id) {
            model.clientId = id;
            model.client = "";
            model.endClientSearch();
        };

        // Asigns an article when an option is clicked on the autocomplete search options.
        model.selectArticle = function(id) {

            // Gets the article from the lookupArray (taken from Mongo).
            var article = arrayService.lookup(id, model.lookupArticles)[0];

            // If the article has been added before, increases the quantity.
            if (arrayService.lookup(id, model.articles)[0]) {
                arrayService.lookup(id, model.articles)[0].quantity++;
            }
            // If it hasn't, add a new item to the articles array.
            else {
                model.articles.push({
                    _id: id,
                    description: article.description,
                    price: article.price,
                    quantity: 1,
                    max: article.stock
                });
            }

            model.displayTotals();
            model.endArticleSearch();
        };

        // This function is invoked through the use of the + button on the model.articles html list.
        model.addArticle = function(id) {
            var article = arrayService.lookup(id, model.articles)[0];

            // The quantity cannot be higher than what's currently available in the inventory.
            if (article.quantity < article.max) {
                article.quantity++;
            }
            else {
                popUp("error",
                    true,
                    "No existen mas articulos iguales en el inventario...",
                    function() {
                        model.disableForm = false;
                    });
            }

            model.displayTotals();
        };

        // This function is invoked through the use of the - button on the model.articles html list.
        model.removeArticle = function(id, index) {
            var article = arrayService.lookup(id, model.articles)[0];
            article.quantity--;

            // If the quantity reaches 0, delete the row.
            if (article.quantity === 0) {
                //model.articles.splice(index, 1);
            }

            model.displayTotals();
        };

        model.displayTotals = function() {
            // Initializes the price value to zero.
            model.price = 0;
            model.articles.forEach(function(item) {
                for (var i = 0; i < item.quantity; i++) {
                    model.price += item.price;
                }
            });

            // Matches the remaining to that of the total price before substracting every advance.
            model.remaining = model.price;
            model.advances.forEach(function(item) {
                model.remaining -= item.amount;
            });
        };

        // Sends the new reservation to the service to be saved.
        model.saveReservation = function() {
            var articleIds = [];

            // Creates an id array for articles to be saved into Mongo.
            model.articles.forEach(function(item) {
                // Insert an article only if it has any items. If it doesn't skip it, 
                // As the article is still in the array it will be used to update the inventory.
                if (item.quantity > 0) {
                    articleIds.push({ article: item._id, quantity: item.quantity });
                }

                inventoryService.get(item._id).$promise
                    .then(function(result) {
                        result.results.stock -= (item.originalQuantity ? (item.quantity - item.originalQuantity) : item.quantity);

                        inventoryService.save(result.results);
                    });
            });

            // Creates the reservation object.
            var reservation = {
                _id: model.id,
                client: model.clientId,
                invoice: model.invoice,
                date: model.date,
                articles: articleIds,
                price: model.price,
                advances: model.advances
            };

            // Sends the save command to the reservationService.
            reservationService.save(reservation).$promise
                .then(function(response) {
                    popUp("success",
                        true,
                        "El Apartado se ha guardado con exito!",
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

        model.editReservation = function() {
            // Hides the EDIT button.
            model.editingReservation = false;

            // Enables the form.
            model.disableForm = false;
        };

        model.cancelEditReservation = function() {
            popUp("confirm",
                true,
                "Esta seguro que desea cancelar? Perdera los cambios.",
                // Sets the custom action to perform when canceling.
                function() {
                    model.$router.navigate(["ReservationList"]);
                },
                function() {
                    model.disableForm = model.editingReservation;
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
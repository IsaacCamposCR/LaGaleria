(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("reservationComponent", {
        templateUrl: "/components/reservation-component/reservation/reservation.component.html",
        controllerAs: "model",
        controller: ["clientService", "inventoryService", "reservationService", reservationController],
        bindings: {
            "$router": "<"
        }
    });

    function reservationController(clientService, inventoryService, reservationService) {
        var model = this;

        // Cleans up the form for a new reservation.
        var newReservation = function () {
            // Form properties
            model.invoice = "";
            model.date = new Date();
            model.price = "";
            model.client = "";
            model.articles = [];

            //Advances form properties
            model.advanceAmount = "";
            model.advanceDate = new Date();
            model.advances = [];

            // Lookup properties
            model.lookupClients = [];
            model.lookupArticles = [];
        };

        var loadReservation = function (id) {
            // Calls the reservation service for a reservation by id.
            reservationService.get(id).$promise
                .then(function (result) {
                    model.invoice = result.results.invoice;
                    model.date = result.results.date;
                    model.price = result.results.price;

                    // Calls the client service for the client name.
                    model.clientId = result.results.client;
                    clientService.get(result.results.client).$promise
                        .then(function (result) {
                            model.client = result.results.name;
                        });

                    // TODO: Calls the article service
                    ////////////////////////////
                });
        };

        model.$routerOnActivate = function (next) {
            // Takes the id from the parameters in the new url.
            if (next.params.id) {
                loadReservation(next.params.id);
            } else {
                newReservation();
            }
        };

        // When the user starts typing in the Client field, 
        // the search triggers to show matching results by name.
        model.beginClientSearch = function () {
            if (model.client !== "") {
                // Queries the client service for matching clients by name.
                clientService.find(model.client).$promise
                    .then(function (result) {
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
        model.endClientSearch = function () {
            model.lookupClient = false;
        };

        // When the user starts typing in the Article field, 
        // the search triggers to show matching results by name.
        model.beginArticleSearch = function () {
            if (model.article !== "") {
                // Queries the inventory service for matching articles by description.
                inventoryService.filter(model.article).$promise
                    .then(function (result) {
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
        model.endArticleSearch = function () {
            model.lookupArticle = false;
        };

        // Asigns a client when an option is clicked on the autocomplete search options.
        model.selectClient = function (id) {
            model.clientId = id;
            model.client = lookupItemFromArray(id, model.lookupClients).name;
            model.endClientSearch();
        };

        // Asigns an article when an option is clicked on the autocomplete search options.
        model.selectArticle = function (id) {
            var article = lookupItemFromArray(id, model.lookupArticles);
            model.price = Number(model.price + article.price);
            model.articles.push({ id: id, description: article.description, price: article.price });
            model.endArticleSearch();
        };

        // Looks up the model.categories array to select the one with a certain id.
        var lookupItemFromArray = function (id, array) {
            // The filter function is not supported on older browsers...
            var result = array.filter(function (item) {
                return item._id == id;
            });
            return result[0];
        };

        model.addAdvance = function () {
            model.advances.push({
                amount: model.advanceAmount,
                date: model.advanceDate
            });
        };

        // Sends the new reservation to the service to be saved.
        model.saveReservation = function () {
            var articleIds = [];
            model.articles.forEach(function (item) {
                articleIds.push({ article: item.id });
            });

            var reservation = {
                client: model.clientId,
                invoice: model.invoice,
                date: model.date,
                articles: articleIds,
                price: model.price,
                advances: model.advances
            };

            reservationService.save(reservation).$promise
                .then(function (response) {
                    popUp("success",
                        true,
                        "El Apartado se ha creado con exito!",
                        function () {
                            model.$router.navigate(["ReservationList"]);
                        });
                })
                .catch(function (response) {
                    console.log(response.errors);
                    popUp("error",
                        true,
                        "Ha ocurrido un error...",
                        function () { });
                });
        };

        model.cancelEditReservation = function () {
            popUp("confirm",
                true,
                "Esta seguro que desea cancelar? Perdera los cambios.",
                // Sets the custom action to perform when canceling.
                function () {
                    model.$router.navigate(["ReservationList"]);
                },
                function () {
                    model.disableForm = model.editingProvider;
                });
        };

        // Pop up message component. The model.pop property allows the form to hide the buttons when displaying the popup. 
        // This mechanism might not be required once styles are put in.
        var popUp = function (type, pop, message, confirm, cancel) {
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
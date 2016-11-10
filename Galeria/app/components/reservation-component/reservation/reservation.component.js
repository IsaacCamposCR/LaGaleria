(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("reservationComponent", {
        templateUrl: "/components/reservation-component/reservation/reservation.component.html",
        controllerAs: "model",
        controller: ["clientService", "inventoryService", "reservationService", reservationController],
        bindings: {

        }
    });

    function reservationController(clientService, inventoryService, reservationService) {
        var model = this;

        model.$onInit = function () {
            model.date = new Date();
        };

        // When the user starts typing in the Client field, 
        // the search triggers to show matching results by name.
        model.beginClientSearch = function () {
            if (model.client !== "") {

                // Queries the client service for matching clients by name.
                clientService.find(model.client).$promise
                    .then(function (result) {
                        model.clients = result.results;
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

        // When the user starts typing in the Article field, 
        // the search triggers to show matching results by name.
        model.beginArticleSearch = function () {
            if (model.article !== "") {
                // Queries the inventory service for matching articles by description.
                inventoryService.filter(model.article).$promise
                    .then(function (result) {
                        model.articles = result.results;
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

        // Disable search options for clients.
        model.endClientSearch = function () {
            model.lookupClient = false;
        };

        // Disable search options for articles.
        model.endArticleSearch = function () {
            model.lookupArticle = false;
        };

        // Asigns a client when an option is clicked on the autocomplete search options.
        model.selectClient = function (id) {
            model.clientId = id;
            model.client = lookupItemFromArray(id, model.clients).name;
            model.endClientSearch();
        };

        // Asigns an article when an option is clicked on the autocomplete search options.
        model.selectArticle = function (id) {
            var article = lookupItemFromArray(id, model.articles);
            model.price = article.price;
            model.articleId = id;
            model.article = article.description;
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

        model.saveReservation = function () {
            var reservation = {
                client: model.clientId,
                invoice: model.invoice,
                date: model.date,
                article: model.articleId,
                price: model.price,
                advances: model.advances,
            };

            reservationService.save(reservation).$promise
                .then()
                .catch();
        };
    }

} ());
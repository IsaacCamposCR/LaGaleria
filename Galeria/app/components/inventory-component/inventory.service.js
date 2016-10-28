(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.factory("inventoryService", function ($resource) {
        console.log("Registering inventory service...");

        // Creates a new resource for the endpoint with an id parameter.
        var resource = $resource("/api/article/:id",
            { id: "@id" },
            {
                query: {
                    method: "GET",
                    isArray: false
                }
            });

        // Function to validate an article before sending it to the article endpoint to be saved.
        var saveArticle = function (article) {
            console.log("inventory.service: Saving article...");

            // Saves the data to the endpoint, asynchronous.
            return resource.save(article);
        };

        // Function to retrieve an unfiltered list of all articles.
        var listArticles = function (category) {
            console.log("inventory.service: Getting all articles...");

            // Returns the result from the endpoint, asynchronous.
            return resource.query({ category: category });
        };

        var listByArticleDescription = function (description, category) {
            console.log("inventory.service: Getting articles by description");

            // Returns a result from the endpoint, asynchronous.
            return resource.query({ description: description, category: category });
        }

        var getArticle = function (id) {
            console.log("inventory.service: Getting single article by id...");

            // Returns the result from the endpoint, contains an asynchronous promise to be processed at the component.
            return resource.query({ id: id });
        };

        return {
            //Exposed API's
            save: saveArticle,
            get: getArticle,
            list: listArticles,
            find: listByArticleDescription
        };
    });
} ());
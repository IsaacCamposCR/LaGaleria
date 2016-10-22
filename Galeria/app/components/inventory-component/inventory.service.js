(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.factory("inventoryService", function ($resource) {
        console.log("Registering inventory service...");

        // Function to validate an article before sending it to the article endpoint to be saved.
        var saveArticle = function (article) {
            console.log("inventory.service: Saving article...");

            // Creates a new resource object for the endpoint.
            var resource = $resource("/api/article/");

            // Validations

            // Saves the data to the endpoint, asynchronous.
            return resource.save(article);
        };

        // Function to retrieve an unfiltered list of all articles.
        var listArticles = function (name) {
            console.log("inventory.service: Getting all articles...");

            // Creates a new resource for the endpoint.
            var resource = $resource("/api/article/");

            // Returns the result from the endpoint, asynchronous.
            return resource.query({ name: name });
        };

        var getArticle = function (id) {
            console.log("inventory.service: Getting single article by id...");

            // Creates a new resource for the endpoint with an id parameter.
            var resource = $resource("/api/article/:id",
                { id: "@id" },
                {
                    query: {
                        method: "GET",
                        isArray: false
                    }
                });

            // Returns the result from the endpoint, contains an asynchronous promise to be processed at the component.
            return resource.query({ id: id });
        };

        return {
            //Exposed API's
            save: saveArticle,
            get: getArticle,
            list: listArticles
        };
    });
} ());
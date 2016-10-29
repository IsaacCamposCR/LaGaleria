(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.factory("inventoryService", function ($resource) {

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

            // Saves the data to the endpoint, asynchronous.
            return resource.save(article);
        };

        // Function to retrieve an unfiltered list of all articles.
        var listArticles = function (category) {

            // Returns the result from the endpoint, asynchronous.
            return resource.query({ category: category });
        };

        var listByArticleDescription = function (description, category) {

            // Returns a result from the endpoint, asynchronous.
            return resource.query({ description: description, category: category });
        }

        var getArticle = function (id) {

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
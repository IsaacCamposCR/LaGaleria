(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.factory("categoryService", function ($resource) {
        console.log("Registering category service...");

        // Function to validate a category before sending it to the category endpoint to be saved.
        var saveCategory = function (category) {
            console.log("category.service: Saving category...");

            // Creates a new resource object for the endpoint.
            var resource = $resource("/api/category/");

            // Validations

            // Saves the data to the endpoint, asynchronous.
            return resource.save(category);
        };

        // Function to retrieve a list of all categories.
        var listCategories = function (category) {
            console.log("category.service: Getting all categories...");

            // Creates a new resource for the endpoint.
            var resource = $resource("/api/category/");

            // Returns the result from the endpoint, asynchronous.
            return resource.query();
        };

        var getCategory = function (category) {
            console.log("category.service: Getting single category...");

            // Creates a new resource for the endpoint with an category parameter.
            var resource = $resource("/api/category/:category",
                { category: "@category" },
                {
                    query: {
                        method: "GET",
                        isArray: false
                    }
                });

            // Returns the result from the endpoint, contains an asynchronous promise to be processed at the component.
            return resource.query({ category: category });
        };

        return {
            save: saveCategory,
            list: listCategories,
            get: getCategory
        };
    });
} ());
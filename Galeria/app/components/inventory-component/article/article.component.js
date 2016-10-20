(function () {
    "use strict";

    var module = angular.module("theGallery");

    console.log("Creating article component...");
    module.component("articleComponent", {
        templateUrl: "/components/inventory-component/article/article.component.html",
        controllerAs: "model",
        //The inventoryService must be added as a literal string in order to remain when the js is minified.
        controller: ["inventoryService", articleController],
        bindings: {
            "$router": "<"
        }
    });

    // When the component is activated (From inventory).
    // Load the data from the article, or create a blank form for a new article.
    function articleController(inventoryService) {
        var model = this;

        model.$routerOnActivate = function (next) {
            //The Category and Provider array must be filled regardless of the origin page.
            model.selectedCategory = "";
            model.categories = ["Angeles","Elefantes","Buhos"];

            model.selectedProvider = "";
            model.providers = ["MADI", "Coca-Cola"];

            // Takes the id from the parameters in the new url.
            if (next.params.id) {
                // Calls the inventory service for an article by id.
                inventoryService.get(next.params.id)
                    // This call is asynchronous so a callback must be used in the promise to process the data.
                    .$promise.then(function (result) {
                        

                        //Disable the form when an existing article is loaded.
                        model.disableForm = true;
                    });
            }
            else {
                // Creates a blank form for a new article.

                // Enables the form if no article is loaded.
                model.disableForm = false;
            }
        };

        model.$onInit = function () { }

    }
} ());
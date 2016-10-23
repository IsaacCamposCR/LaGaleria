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

    function articleController(inventoryService) {

        var model = this;

        // When the component is activated (From inventory).
        // Load the data from the article, or create a blank form for a new article.
        model.$routerOnActivate = function (next) {
            //The Category and Provider array must be filled regardless of the origin page.
            model.categories = ["Angeles", "Elefantes", "Buhos"];

            model.providers = ["MADI", "Coca-Cola"];

            // Takes the id from the parameters in the new url.
            if (next.params.id) {
                model.title = "Editar Articulo";

                // Calls the inventory service for an article by id.
                console.log(next.params.id);
                inventoryService.get(next.params.id)
                    // This call is asynchronous so a callback must be used in the promise to process the data.
                    .$promise.then(function (result) {

                        console.log(result.invoice);
                        model.selectedCategory = result.category;
                        model.selectedProvider = result.provider;
                        model.invoice = result.invoice;
                        model.description = result.description;
                        model.stock = result.stock;
                        model.price = result.price;
                        console.log(model.invoice);
                        //Disable the form when an existing article is loaded.
                        model.disableForm = true;
                    });
            }
            else {
                model.title = "Nuevo Articulo";
                // Creates a blank form for a new article.
                model.selectedCategory = "";
                model.selectedProvider = "";
                model.invoice = "";
                model.description = "";
                model.stock = 0;
                model.price = 0;

                // Enables the form if no article is loaded.
                model.disableForm = false;
            }
        };

        model.$onInit = function () { };

        model.addNewArticle = function () {
            var article = {
                category: model.selectedCategory,
                provider: model.selectedProvider,
                code: model.code,
                description: model.description,
                stock: model.stock,
                price: model.price
            };

            console.log("article.component: Saving article...");
            inventoryService.save(article);

            // Programatically navigates to the inventory component.
            model.$router.navigate(["Inventory"]);
        };

    }
} ());
(function () {

    "use strict";

    var module = angular.module("theGallery");

    console.log("Creating article component...");
    module.component("articleComponent", {
        templateUrl: "/components/inventory-component/article/article.component.html",
        controllerAs: "model",
        //The inventoryService must be added as a literal string in order to remain when the js is minified.
        controller: ["inventoryService", "categoryService", articleController],
        bindings: {
            "$router": "<"
        }
    });

    function articleController(inventoryService, categoryService) {

        var model = this;

        // When the component is activated (From inventory).
        // Load the data from the article, or create a blank form for a new article.
        model.$routerOnActivate = function (next) {
            // This array must be initialized as empty before populating it from database.
            model.categories = [];

            //The Category and Provider array must be filled regardless of the origin page.
            categoryService.list().$promise
                .then(function (results) {

                    // Need to find an easier way to return an array with strings instead of an array of
                    // objects straight from mongo.
                    results.forEach(function (item) {
                        model.categories.push(item.category);
                    });

                    model.providers = ["MADI", "Coca-Cola"];

                    // Takes the id from the parameters in the new url.
                    if (next.params.id) {
                        loadArticle(next.params.id);
                    }
                    else {
                        newArticle();
                    }
                });
        };

        var loadArticle = function (id) {
            model.title = "Editar Articulo";

            // Calls the inventory service for an article by id.
            inventoryService.get(id)
                // This call is asynchronous so a callback must be used in the promise to process the data.
                .$promise.then(function (result) {

                    model.selectedCategory = result.category;
                    console.log(result.category);
                    model.selectedProvider = result.provider;
                    model.code = result.code;
                    model.description = result.description;
                    model.stock = result.stock;
                    model.price = result.price;

                    //Disable the form when an existing article is loaded.
                    model.disableForm = true;
                });
        };

        var newArticle = function () {
            // If no categories exist in the database, only show the add new panel.
            if (model.categories.length > 0) {
                model.selectedCategory = model.categories[0];
            }
            else {
                model.editingCategory = true;
            }

            // Creates a blank form for a new article.
            model.title = "Nuevo Articulo";
            model.selectedProvider = "";
            model.invoice = "";
            model.description = "";
            model.stock = 0;
            model.price = 0;

            // Enables the form if no article is loaded.
            model.disableForm = false;
        };

        model.$onInit = function () { };

        model.addNewArticle = function () {
            // Creates a new article to send to the service instead of the complete model.
            var article = {
                category: model.selectedCategory,
                provider: model.selectedProvider,
                code: model.code,
                description: model.description,
                stock: model.stock,
                price: model.price
            };

            console.log(model.selectedCategory);

            console.log("article.component: Saving article...");
            inventoryService.save(article);

            // Programatically navigates to the inventory component.
            model.$router.navigate(["Inventory"]);
        };

        model.newCategory = function () {
            model.editingCategory = true;
        };

        model.addNewCategory = function () {
            model.editingCategory = false;

            categoryService.save({ category: model.category });
            model.categories.push(model.category);
            model.categories.sort();
            model.selectedCategory = model.category;
        };

        model.editCategory = function () {
            model.editingCategory = true;
            model.category = model.selectedCategory.category;
        };

        model.cancelEdit = function () {
            model.editingCategory = false;
        };

    }
} ());
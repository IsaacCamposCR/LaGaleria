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
            loadCategories().then(function () {

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

                    console.log(result.category);
                    model.selectedCategory = lookupCategoryFromModel(result.category);
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

        // Loads the categories into the selector. Returns a promise to be handled.
        var loadCategories = function () {
            // Cleans the categories array before populating it again.
            model.categories = [];

            var categoriesPromise = categoryService.list().$promise
                .then(function (result) {
                    // Creates the new updated category array.
                    result.results.forEach(function (item) {
                        model.categories.push(item);
                    });

                    model.selectedCategory = model.categories[0];
                });

            return categoriesPromise;
        };

        // Looks up the mode.categories array to select the one with a certain id.
        var lookupCategoryFromModel = function (id) {
            // The filter function is not supported on older browsers...
            var result = model.categories.filter(function (category) {
                return category._id == id;
            });
            return result[0];
        };

        model.addNewArticle = function () {
            // Creates a new article to send to the service instead of the complete model.
            var article = {
                category: model.selectedCategory._id,
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

        model.addNewCategory = function () {
            console.log("saving new category...");
            model.editingCategory = false;
            var categoryPromise;

            // If the category has to be added.
            if (model.isNewCategory) {
                // The object's categoryName is named this way so that the endpoint won't take it as query string parameter.
                categoryPromise = categoryService.save({ categoryName: model.category }).$promise;
            }
            // If the category has to be updated.
            else {
                categoryPromise = categoryService.save({ _id: model.selectedCategory._id, categoryName: model.category }).$promise;
            }

            categoryPromise
                .then(function (response) {
                    loadCategories()
                        .then(function () {
                            // Selects the newly added category.
                            model.selectedCategory = lookupCategoryFromModel(response.results._id);
                        });
                })
                .catch(function (response) { console.log("failure", response); });
        };

        // Category Panel handling

        model.newCategory = function () {
            model.category = "";
            model.isNewCategory = true;
            model.editingCategory = true;
        };

        model.editCategory = function () {
            model.category = model.selectedCategory.category;
            model.isNewCategory = false;
            model.editingCategory = true;
        };

        model.cancelEdit = function () {
            model.editingCategory = false;
        };

    }
} ());
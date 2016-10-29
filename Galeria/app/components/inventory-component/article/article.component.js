(function () {

    "use strict";

    var module = angular.module("theGallery");

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

            // Calls the inventory service for an article by id.
            inventoryService.get(id)
                // This call is asynchronous so a callback must be used in the promise to process the data.
                .$promise.then(function (result) {

                    model._id = result.results._id;
                    model.selectedCategory = lookupCategoryFromModel(result.results.category);
                    model.selectedProvider = result.results.provider;
                    model.code = result.results.code;
                    model.description = result.results.description;
                    model.stock = result.results.stock;
                    model.price = result.results.price;

                    //Disable the form when an existing article is loaded.
                    model.disableForm = true;

                    // Enables the EDIT button.
                    model.editingArticle = true;

                    // Changes the page main title.
                    model.title = "Detalles del Articulo";
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
            model.selectedProvider = "";
            model.invoice = "";
            model.description = "";
            model.stock = 0;
            model.price = 0;

            // Enables the form if no article is loaded.
            model.disableForm = false;

            // Changes the page main title.
            model.title = "Nuevo Articulo";
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

        model.saveArticle = function () {
            // Creates a new article to send to the service instead of the complete model.
            var article = {
                _id: model._id,
                category: model.selectedCategory._id,
                provider: model.selectedProvider,
                code: model.code,
                description: model.description,
                stock: model.stock,
                price: model.price
            };

            inventoryService.save(article);

            popUp(true,
                "Articulo guardado con exito!",
                // Programatically navigates to the inventory component.
                function () {
                    model.$router.navigate(["Inventory"])
                });
        };

        model.addNewCategory = function () {
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
                    popUp(true,
                        "Categoria guardada con exito!",
                        // Sets the custom action to perform when a category is saved.
                        function () {
                            model.disableForm = false;
                        });
                })
                .catch(function (response) {
                    console.log("Error:", response);
                    popUp(true,
                        "Ha ocurrido un error.",
                        // Sets the custom action to perform when saving a client.
                        function () {
                            // Programatically navigates to the ClientList component.
                            model.$router.navigate(["Inventory"]);
                        });
                });
        };

        model.editArticle = function () {
            // Enables the form in order for the user to update the article.
            model.disableForm = false;

            // Hides the EDIT button.
            model.editingArticle = false;
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

        model.cancel = function () {
            popUp(true, "Esta seguro que desea cancelar? Perdera los cambios.",
                // Sets the custom action to perform when canceling.
                function () {
                    model.$router.navigate(["Inventory"]);
                });
        };

        // Pop up message component. The model.pop property allows the form to hide the buttons when displaying the popup. 
        // This mechanism might not be required once styles are put in.
        var popUp = function (pop, message, confirm) {
            model.message = message;
            model.pop = pop;
            model.disableForm = true;
            model.confirm = confirm;
        };
    }
} ());
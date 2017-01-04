(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("articleComponent", {
        templateUrl: "/components/inventory-component/article/article.component.html",
        controllerAs: "model",
        //The inventoryService must be added as a literal string in order to remain when the js is minified.
        controller: ["inventoryService", "categoryService", "providerService", "arrayService", articleController],
        bindings: {
            "$router": "<"
        }
    });

    function articleController(inventoryService, categoryService, providerService, arrayService) {

        var model = this;

        // When the component is activated (From inventory).
        // Load the data from the article, or create a blank form for a new article.
        model.$routerOnActivate = function (next) {
            // This array must be initialized as empty before populating it from database.
            model.categories = [];

            model.price = "";

            //The Category and Provider array must be filled regardless of the origin page.
            loadCategories().then(function () {
                loadProviders().then(function () {
                    // Takes the id from the parameters in the new url.
                    if (next.params.id) {
                        loadArticle(next.params.id);
                    }
                    else {
                        newArticle();
                    }
                });
            });
        };

        var loadArticle = function (id) {

            // Calls the inventory service for an article by id.
            inventoryService.get(id)
                // This call is asynchronous so a callback must be used in the promise to process the data.
                .$promise.then(function (result) {
                    // Checks for errors...
                    if (arrayService.errors(result, popUp, "Inventory", model.$router)) {

                        model._id = result.results._id;
                        model.selectedCategory = arrayService.lookup(result.results.category, model.categories)[0];
                        model.selectedProvider = arrayService.lookup(result.results.provider, model.providers)[0];
                        model.code = result.results.code;
                        model.description = result.results.description;
                        model.stock = result.results.stock;
                        // This temp variable is used to store the original stock before it gets updated. 
                        model.tempStock = result.results.stock;
                        model.history = result.results.history;
                        model.price = result.results.price;

                        //Disable the form when an existing article is loaded.
                        model.disableForm = true;

                        // Enables the EDIT button.
                        model.editingArticle = true;

                        // Changes the page main title.
                        model.title = "Detalles del Articulo";
                    }
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
            if (model.providers.length > 0) {
                model.selectedProvider = model.providers[0];

                // Enables the form if no article is loaded.
                model.disableForm = false;
            } else {
                model.disableForm = true;
                popUp("warning",
                    true,
                    "No existen proveedores en la base de datos. Desea ingresar un nuevo proveedor?",
                    function () {
                        model.$router.navigate(["Provider"]);
                    },
                    function () {
                        model.disableForm = false;
                    });
            }
            model.invoice = "";
            model.description = "";
            model.stock = 0;
            model.price = 0;


            // Changes the page main title.
            model.title = "Nuevo Articulo";
        };

        // Loads the categories into the selector. Returns a promise to be handled.
        var loadCategories = function () {
            // Cleans the categories array before populating it again.
            model.categories = [];

            var categoriesPromise = categoryService.list().$promise
                .then(function (result) {
                    // Checks for errors...
                    if (!arrayService.errors(result, popUp, "Inventory", model.$router)) {

                        // Creates the new updated category array.
                        result.results.forEach(function (item) {
                            model.categories.push(item);
                        });
                        if (model.categories.length > 0) {
                            model.selectedCategory = model.categories[0];
                        } else {
                            model.newCategory();
                        }
                    }
                });

            return categoriesPromise;
        };

        var loadProviders = function () {
            // Cleans the providers array before populating it again.
            model.providers = [];

            var providersPromise = providerService.combo().$promise
                .then(function (result) {
                    // Creates the new provider array.
                    result.results.forEach(function (item) {
                        model.providers.push(item);
                    });
                    model.selectedProvider = model.providers[0];
                });

            return providersPromise;
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
                // If the article is new, the history matches the stock, else it has to use a calculated one.
                history: model._id ? (model.history + (model.stock - model.tempStock)) : model.stock,
                price: arrayService.unformat(model.price)
            };

            inventoryService.save(article);

            popUp("success",
                true,
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
                            model.selectedCategory = arrayService.lookup(response.results._id, model.categories)[0];
                        });
                    popUp("success",
                        true,
                        "Categoria guardada con exito!",
                        // Sets the custom action to perform when a category is saved.
                        function () {
                            model.disableForm = false;
                        });
                })
                .catch(function (response) {
                    console.log("Error:", response);
                    popUp("error",
                        true,
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

        model.cancelEditCategory = function () {
            model.editingCategory = false;
        };

        model.cancelEditArticle = function () {
            popUp("confirm",
                true,
                "Esta seguro que desea cancelar? Perdera los cambios.",
                // Sets the custom action to perform when canceling.
                function () {
                    model.$router.navigate(["Inventory"]);
                },
                function () {
                    model.disableForm = model.editingArticle;
                });
        };

        // Wrapper function that determines if a certain response has any errors. 
        // If it does, it displays a popup, if not it continues execution.
        model.hasErrors = function (response) {
            if (response.errors) {
                console.log("Error:", response.errors);
                popUp("error",
                    true,
                    ("Ha ocurrido un error: " + response.errors),
                    // Sets the custom action to perform when saving a client.
                    function () {
                        // Programatically navigates to the ClientList component.
                        model.$router.navigate(["Inventory"]);
                    });
            }
        };

        // Pop up message component. The model.pop property allows the form to hide the buttons when displaying the popup. 
        // This mechanism might not be required once styles are put in.
        var popUp = function (type, pop, message, confirm, cancel) {
            model.messageType = type;
            model.message = message;
            model.pop = pop;
            model.disableForm = true;
            model.confirm = confirm;
            if (cancel) {
                model.cancel = cancel;
            }
        };
    }
} ());
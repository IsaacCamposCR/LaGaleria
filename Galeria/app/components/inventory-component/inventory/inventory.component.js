(function () {
    "use strict";

    var module = angular.module("theGallery");

    console.log("Creating inventory component");
    module.component("inventoryComponent", {
        templateUrl: "/components/inventory-component/inventory/inventory.component.html",
        controllerAs: "model",
        controller: ["inventoryService", "categoryService", inventoryController],
        bindings: {
            "$router": "<"
        }
    });

    function inventoryController(inventoryService, categoryService) {
        var model = this;

        // When the component is initialized, loads all the articles.
        model.$onInit = function () {
            // Replace this with an actual call to the database...
            model.categories = [];
            categoryService.list().$promise.then(function (results) {
                results.forEach(function (item) {
                    model.categories.push({ name: item.category });
                });

                model.populateArticles(false);
            });
        };

        // Article lists are callapsed by default, clicking the article category toggles visibility.
        model.toggleCollapsedCategory = function (category) {
            category.collapsed = !category.collapsed;
        };

        // Finds an article by description.
        model.findArticle = function () {
            console.log("Finding " + model.articleDescription);

            // Replace this with an actual call to the database...
            model.categories = [{ name: "Angeles" }, { name: "Elefantes" }, { name: "Buhos" }];
            model.populateArticles(true);
        };

        // Function creates the article list per each category object in the array. 
        model.populateArticles = function (isFind) {

            // For each member in the categories array, it will attach the article list for that category.
            for (var i = 0; i < model.categories.length; i++) {
                var category = model.categories[i].name;
                if (isFind) {
                    // Calls the article service to find articles by name and category.
                    model.categories[i].articles =
                        inventoryService.find(model.articleDescription, category);
                } else {
                    // Calls the article service to list articles by category.
                    model.categories[i].articles =
                        inventoryService.list(category);
                }

                // Handles the list promise to calculate the amount of articles and totals. (Using an unadviced function inside a function, this is very costly).
                model.categories[i].articles.$promise.then(function (results) {
                    model.updateTotals();
                });
            }

        };

        // Iterates every item from the promise results to calculate totals.
        model.updateTotals = function () {

            model.total = 0;
            model.uniqueArticles = 0;
            model.totalArticles = 0;

            for (var j = 0; j < model.categories.length; j++) {
                // Iterate the article list only if the service returned any record.
                if (model.categories[j].articles) {
                    for (var c = 0; c < model.categories[j].articles.length; c++) {
                        var article = model.categories[j].articles[c];
                        model.total += article.price * article.stock;
                        model.uniqueArticles++;
                        model.totalArticles += article.stock;
                        article = null;
                    }
                }
            }

        };

    }
} ());
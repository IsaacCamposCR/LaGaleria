(function () {
    "use strict";

    var module = angular.module("theGallery");

    console.log("Creating inventory component");
    module.component("inventoryComponent", {
        templateUrl: "/components/inventory-component/inventory/inventory.component.html",
        controllerAs: "model",
        controller: ["inventoryService", inventoryController],
        bindings: {
            "$router": "<"
        }
    });

    function inventoryController(inventoryService) {
        var model = this;

        // When the component is initialized, loads all the articles.
        model.$onInit = function () {
            // Replace this with an actual call to the database...
            model.categories = [{ name: "Angeles" }, { name: "Elefantes" }, { name: "Buhos" }];
            model.populateArticles(false);
        };

        model.toggleCollapsedCategory = function (category) {
            category.collapsed = !category.collapsed;
        };

        model.findArticle = function () {
            console.log("Finding " + model.articleDescription);

            // Replace this with an actual call to the database...
            model.categories = [{ name: "Angeles" }, { name: "Elefantes" }, { name: "Buhos" }];
            model.populateArticles(true);
        };

        model.populateArticles = function (isFind) {

            // For each member in the categories array, it will attach the article list for that category.
            for (var i = 0; i < model.categories.length; i++) {
                var category = model.categories[i].name;
                if (isFind) {
                    model.categories[i].articles =
                        inventoryService.find(model.articleDescription, category);
                } else {
                    model.categories[i].articles =
                        inventoryService.list(category);
                }

                model.categories[i].articles.$promise.then(function (results) {
                    model.updateTotals();
                });
            }

        };

        model.updateTotals = function () {

            model.total = 0;
            model.uniqueArticles = 0;
            model.totalArticles = 0;

            for (var j = 0; j < model.categories.length; j++) {
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
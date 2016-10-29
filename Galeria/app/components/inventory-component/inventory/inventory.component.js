(function () {
    "use strict";

    var module = angular.module("theGallery");

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
            // The false parameter indicates it is not a find command.
            populateArticles(false);
        };

        // Article lists are callapsed by default, clicking the article category toggles visibility.
        model.toggleCollapsedCategory = function (category) {
            category.collapsed = !category.collapsed;
        };

        // Finds an article by description.
        model.findArticle = function () {
            // The true parameter indicates it is a find command.
            populateArticles(true);
        };

        var populateArticles = function (isFind) {
            var articlesPromise;
            model.categories = [];

            categoryService.list().
                $promise.then(function (result) {
                    result.results.forEach(function (item) {
                        var articles = [];
                        if (isFind) {
                            articlesPromise = inventoryService.find(model.articleDescription, item._id).$promise;
                        } else {
                            articlesPromise = inventoryService.list(item._id).$promise;
                        }
                        articlesPromise
                            .then(function (result) {
                                result.results.forEach(function (item) {
                                    articles.push(item);
                                });

                                model.categories.push({
                                    id: item._id,
                                    name: item.category,
                                    articles: articles
                                });

                                updateTotals();
                            });
                    });
                });
        };

        // Iterates every item from the promise results to calculate totals.
        var updateTotals = function () {
            model.categories.sort();

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
(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("inventoryComponent", {
        templateUrl: "/components/inventory-component/inventory/inventory.component.html",
        controllerAs: "model",
        controller: ["inventoryService", "categoryService", "providerService", "arrayService", inventoryController],
        bindings: {
            "$router": "<"
        }
    });

    function inventoryController(inventoryService, categoryService, providerService, arrayService) {
        var model = this;

        // When the component is initialized, loads all the articles.
        model.$onInit = function () {
            arrayService.islogged(model);
            
            model.orderBy = "+description";
            // The false parameter indicates it is not a find command.
            populateArticles(false);
        };

        // Article lists are callapsed by default, clicking the article category toggles visibility.
        model.toggleCollapsedCategory = function (category) {
            category.collapsed = !category.collapsed;

            if (category.class === "glyphicon glyphicon-triangle-bottom") {
                category.class = "glyphicon glyphicon-triangle-top";
            }
            else {
                category.class = "glyphicon glyphicon-triangle-bottom";
            }
        };

        // Finds an article by description.
        model.findArticle = function () {
            // The true parameter indicates it is a find command.
            populateArticles(true);
        };

        var populateArticles = function (isFind) {
            var articlesPromise;
            model.providers = [];
            model.categories = [];

            providerService.combo()
                .$promise.then(function (result) {
                    // Populates the provider array prior to loading all articles, 
                    // instead of querying the database once per each article to get the provider name by id.
                    result.results.forEach(function (item) {
                        model.providers.push(item);
                    });

                    // Queries the category service to load all categories to split the articles by category.
                    categoryService.list().
                        $promise.then(function (result) {
                            result.results.forEach(function (item) {
                                var articles = [];
                                if (isFind) {
                                    // Gets the promise from articles by category id and article description.
                                    articlesPromise = inventoryService.find(model.articleDescription, item._id).$promise;
                                } else {
                                    // Gets the promise from articles by category id.
                                    articlesPromise = inventoryService.list(item._id).$promise;
                                }
                                articlesPromise
                                    .then(function (result) {
                                        // Iterates the promise result to fill the articles
                                        result.results.forEach(function (item) {
                                            // Before pushing the article to the array, it replaces the provider id with the provider name
                                            // by using the provider array and the lookup function.
                                            item.provider = arrayService.lookup(item.provider, model.providers)[0].name;
                                            articles.push(item);
                                        });

                                        // Completes the categories array used to display data in the table.
                                        model.categories.push({
                                            id: item._id,
                                            name: item.category,
                                            articles: articles,
                                            // Sets the collapsed glyph icon.
                                            class: "glyphicon glyphicon-triangle-bottom"
                                        });

                                        // Update the totals for the inventory.
                                        updateTotals();
                                    });
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

        model.sort = function (column) {
            model.orderBy = arrayService.sort(model.orderBy, column);
        };

    }
} ());
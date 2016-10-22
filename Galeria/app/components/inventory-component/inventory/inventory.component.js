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

            // For each member in the categories array, it will attach the article list for that category.
            for (var i = 0; i < model.categories.length; i++) {
                var name = model.categories[i].name;
                model.categories[i].articles = inventoryService.list(name);
            }
        };

        model.toggleCollapsedCategory = function (category) {
            category.collapsed = !category.collapsed;
        };
    }
} ());
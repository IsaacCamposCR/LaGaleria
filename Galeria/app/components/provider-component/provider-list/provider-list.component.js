(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("providerListComponent", {
        templateUrl: "/components/provider-component/provider-list/provider-list.component.html",
        controllerAs: "model",
        controller: ["providerService", "arrayService", providerListController],
        bindings: {
            "$router": "<"
        }
    });

    function providerListController(providerService, arrayService) {
        var model = this;

        // When the component is initialized, loads all the providers.
        model.$onInit = function () {
            arrayService.islogged(model);

            model.orderBy = "+name";
            model.providers = [];

            providerService.list().$promise.then(function (result) {
                result.results.forEach(function (provider) {
                    provider.remaining = 0;
                    if (provider.invoices.length > 0) {
                        provider.invoices.forEach(function (invoice) {
                            provider.remaining += (invoice.type) ? invoice.amount : -invoice.amount;
                        });
                    }
                    model.providers.push(provider);
                });
            });
        };

        // Searches for providers by name.
        model.findProviders = function () {
            model.providers = [];

            providerService.find(model.providerName).$promise.then(function (result) {
                result.results.forEach(function (provider) {
                    provider.remaining = 0;
                    if (provider.invoices.length > 0) {
                        provider.invoices.forEach(function (invoice) {
                            provider.remaining += (invoice.type) ? invoice.amount : -invoice.amount;
                        });
                    }
                    model.providers.push(provider);
                });
            });
        };

        model.sort = function (column) {
            model.orderBy = arrayService.sort(model.orderBy, column);
        };
    }

}());
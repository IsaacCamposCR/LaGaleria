(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("providerListComponent", {
        templateUrl: "/components/provider-component/provider-list/provider-list.component.html",
        controllerAs: "model",
        controller: ["providerService", providerListController],
        binding: {

        }
    });

    function providerListController(providerService) {
        var model = this;

        // When the component is initialized, loads all the providers.
        model.$onInit = function () {
            providerService.list().$promise.then(function (result) {
                model.providers = result.results;
            });
        };

        // Searches for providers by name.
        model.findProviders = function () {
            providerService.find(model.providerName).$promise.then(function (result) {
                model.providers = result.results;
            });
        };
    }

} ());
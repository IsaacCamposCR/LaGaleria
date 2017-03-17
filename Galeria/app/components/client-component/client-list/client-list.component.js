(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("clientListComponent", {
        templateUrl: "/components/client-component/client-list/client-list.component.html",
        controllerAs: "model",
        //The clientService must be added as a literal string in order to remain when the js is minified.
        controller: ["clientService", "arrayService", clientListController],
        bindings: {
            "$router": "<"
        }
    });

    function clientListController(clientService, arrayService) {

        var model = this;

        // When the component is initialized, loads all the clients.
        model.$onInit = function () {
            arrayService.islogged(model);
            
            model.orderBy = "+name";

            clientService.list().$promise.then(function (result) {
                model.clients = result.results;
            });
        };

        // Searches for clients by name.
        model.findClient = function () {
            clientService.find(model.clientName).$promise.then(function (result) {
                model.clients = result.results;
            });
        };

        model.sort = function (column) {
            model.orderBy = arrayService.sort(model.orderBy, column);
        };
    }

} ());
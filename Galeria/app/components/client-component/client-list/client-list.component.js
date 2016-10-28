(function () {

    "use strict";

    var module = angular.module("theGallery");

    console.log("Creating client-list component...");
    module.component("clientListComponent", {
        templateUrl: "/components/client-component/client-list/client-list.component.html",
        controllerAs: "model",
        //The clientService must be added as a literal string in order to remain when the js is minified.
        controller: ["clientService", clientListController]
    });

    function clientListController(clientService) {

        var model = this;

        // When the component is initialized, loads all the clients.
        model.$onInit = function () {
            clientService.list().$promise.then(function (result) {
                model.clients = result.results;
            });
        };

        // Searches for clients by name.
        model.findClient = function () {
            console.log("Finding " + model.clientName);
            model.clients = clientService.find(model.clientName);
        };
    }

} ());
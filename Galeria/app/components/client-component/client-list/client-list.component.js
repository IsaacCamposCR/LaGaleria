(function () {

    "use strict";

    var module = angular.module("theGallery");

    console.log("Creating client-list component...");
    module.component("clientListComponent", {
        templateUrl: "/components/client-component/client-list/client-list.component.html",
        controllerAs: "model",
        controller: ["clientService", clientListController]
    });

    function clientListController(clientService) {

        var model = this;

        model.$onInit = function () {
            model.clients = clientService.list();
        };

        model.findClient = function () {
            console.log("Finding " + model.clientName);
            model.clients = clientService.find(model.clientName);
        };
    }

} ());
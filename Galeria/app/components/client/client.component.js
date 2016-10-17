(function () {

    "use strict";

    var module = angular.module("theGallery");

    console.log("Creating client component...");
    module.component("clientComponent", {
        templateUrl: "/components/client/client.component.html",
        controllerAs: "model",
        controller: ["clientService", clientController]
    });

    function clientController(clientService) {

        var model = this;

        model.$onInit = function () {
            model.name = "";
            model.phones = [""];
        };

        model.addNewClientPhone = function () {
            model.phones.push("");
        };

        model.removeNewClientPhone = function (index) {
            model.phones.splice(index, 1);
        };

        model.savePhone = function (index, phone) {
            model.phones[index] = phone;
        };

        model.addNewClient = function () {
            var client = {
                id: "1",
                name: model.name,
                phones: model.phones
            };

            console.log("client.component: Saving client...");
            console.log(client);
            clientService.save(client);
        };

        model.cancel = function () {

        };
    }

} ());
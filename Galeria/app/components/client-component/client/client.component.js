(function () {

    "use strict";

    var module = angular.module("theGallery");

    console.log("Creating client component...");
    module.component("clientComponent", {
        templateUrl: "/components/client-component/client/client.component.html",
        controllerAs: "model",
        controller: ["clientService", clientController]
    });

    function clientController(clientService) {

        var model = this;

        model.$routerOnActivate = function (next) {
            if (next.params.id) {
                clientService.get(next.params.id)
                    .$promise.then(function (result) {
                        model.id = result.id;
                        model.name = result.name;
                        model.phones = result.phones;
                        model.disableForm = true;
                    });
            }
            else {
                model.name = "";
                model.phones = [""];
                model.disableForm = false;
            }
        };

        model.$onInit = function () {
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
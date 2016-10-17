(function () {

    "use strict";

    var module = angular.module("theGallery");

    console.log("Creating client component...");
    module.component("client", {
        templateUrl: "/components/client/client.component.html",
        controllerAs: "model",
        controller: [clientController]
    });

    function clientController() {

        var model = this;

        model.$onInit = function () {

            console.log("Init client");
            model.name = "Isaac";
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
        };

        model.cancel = function () {

        };
    }

} ());
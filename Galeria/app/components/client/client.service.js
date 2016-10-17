(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.factory("clientService", function ($resource) {
        console.log("Registering client service...");

        var resource = $resource("/data/client/:id", { id: "@id" });

        var saveClient = function (client) {
            console.log("client.service: Saving client...");
            return resource.save(client);
        };

        return {
            save: saveClient
        };
    });

} ());


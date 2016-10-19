(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.factory("clientService", function ($resource) {
        console.log("Registering client service...");
        /*var resource = $resource("/data/client/",
            find: {
                url: "",
                method: "GET",
                params: {
                    clientName: "@clientName"
                },
                isArray: true
            });*/

        var resource = $resource("/data/client/:name",
            { name: "@name" },
            {
                query: {
                    method: "GET",
                    isArray: true
                }
            });

        var saveClient = function (client) {
            console.log("client.service: Saving client...");

            // Validation: Remove empty phones from the phones array.
            for (var i = 0; i <= client.phones.length; i++) {
                if (client.phones[i] === "") {
                    client.phones.splice(i, 1);
                }
            }

            return resource.save(client);
        };

        var listClients = function () {
            console.log("client.service: Retrieving clients...");

            return resource.query();
        };

        var listByClientName = function (clientName) {
            console.log("client.service: Finding by client name...");

            return resource.query({name: clientName});
        };

        return {
            save: saveClient,
            list: listClients,
            find: listByClientName
        };
    });

} ());


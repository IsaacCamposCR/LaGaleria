(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.factory("clientService", function ($resource, $http) {
        console.log("Registering client service...");

        var saveClient = function (client) {
            console.log("client.service: Saving client...");
            var resource = $resource("/data/client/");

            // Validation: Remove empty phones from the phones array.
            for (var i = 0; i <= client.phones.length; i++) {
                if (client.phones[i] === "") {
                    client.phones.splice(i, 1);
                }
            }
            console.log(client);
            return resource.save(client);
        };

        var getClient = function (id) {
            console.log("client.service: Getting single client by id...");

            var resource = $resource("/data/client/:id",
                { id: "@id" },
                {
                    query: {
                        method: "GET",
                        isArray: false
                    }
                });

            return resource.query({ id: id });
        };

        var listClients = function () {
            console.log("client.service: Retrieving clients...");
            var resource = $resource("/data/clients/");

            return resource.query();
        };

        var listByClientName = function (clientName) {
            console.log("client.service: Finding by client name...");
            var resource = $resource("/data/clients/:name",
            { name: "@name" },
            {
                query: {
                    method: "GET",
                    isArray: true
                }
            });

            return resource.query({ name: clientName });
        };

        return {
            save: saveClient,
            get: getClient,
            list: listClients,
            find: listByClientName
        };
    });

} ());


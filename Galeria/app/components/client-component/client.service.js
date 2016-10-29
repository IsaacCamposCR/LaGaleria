(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.factory("clientService", function ($resource) {

        var resource = $resource("/api/client/:id",
            { id: "@id" },
            {
                query: {
                    method: "GET",
                    isArray: false
                }
            });

        // Function to validate a client before sending it to the client endpoint to be saved.
        var saveClient = function (client) {

            // Validation: Remove empty phones from the phones array and then sorts.
            for (var i = 0; i <= client.phones.length; i++) {
                if (client.phones[i] === "") {
                    client.phones.splice(i, 1);
                }
            }
            client.phones.sort();

            // Saves the data to the endpoint, asynchronous.
            return resource.save(client);
        };

        // Function to retrieve a single client by id to be used in the client page.
        var getClient = function (id) {

            // Returns the result from the endpoint, contains an asynchronous promise to be processed at the component.
            return resource.query({ id: id });
        };

        // Function to retrieve an unfiltered list of all clients.
        var listClients = function () {

            // Returns the result from the endpoint, asynchronous.
            return resource.query();
        };

        // Function to retrieve a list of all clients filtered by name.
        var listByClientName = function (clientName) {

            // Returns a result from the endpoint, asynchronous.
            return resource.query({ name: clientName });
        };

        return {
            // Exposed API's
            save: saveClient,
            get: getClient,
            list: listClients,
            find: listByClientName
        };
    });

} ());


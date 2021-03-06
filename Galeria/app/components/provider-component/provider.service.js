(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.factory("providerService", function ($resource) {

        var resource = $resource("/api/provider/:id",
            { id: "@id" },
            {
                query: {
                    method: "GET",
                    isArray: false
                }
            });

        var saveProvider = function (provider) {

            // Validation: Remove empty phones from the phones array and then sorts.
            for (var i = 0; i <= provider.phones.length; i++) {
                if (provider.phones[i] === "") {
                    provider.phones.splice(i, 1);
                }
            }
            // Sorting before saving is important to ensure the uniqueness of the phones array in Mongo.
            provider.phones.sort();

            // Saves the data to the endpoint, asynchronous.
            return resource.save(provider);
        };

        var addInvoice = function (invoice) {
            // Saves the data to the endpoint, asynchronous.
            return resource.save(invoice);
        };

        var getProvider = function (id) {
            // Returns the result from the endpoint, contains an asynchronous promise to be processed at the component.
            return resource.query({ id: id });
        };

        var listProviders = function () {
            // Returns the result from the endpoint, asynchronous.
            return resource.query();
        };

        // Function to retrieve a list of all providers filtered by name.
        var listByProviderName = function (providerName) {
            // Returns a result from the endpoint, asynchronous.
            return resource.query({ name: providerName });
        };

        // Function to retrieve a list of all ids and names from providers.
        var listForCombo = function () {
            // Returns a result from the endpoint, asynchronous.
            return resource.query({ combo: true });
        };

        // Retrieves a list of all invoices in a provider by id.
        var invoicesFromProvider = function (id) {
            var resource = $resource("/api/provider/:id/invoices",
                { id: "@id" },
                {
                    query: {
                        method: "GET",
                        isArray: false
                    }
                });

            return resource.query({ id: id });
        };

        return {
            save: saveProvider,
            get: getProvider,
            list: listProviders,
            combo: listForCombo,
            find: listByProviderName,
            add: addInvoice,
            invoice: invoicesFromProvider
        };
    });
} ());
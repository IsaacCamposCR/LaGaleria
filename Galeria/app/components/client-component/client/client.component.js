(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("clientComponent", {
        templateUrl: "/components/client-component/client/client.component.html",
        controllerAs: "model",
        //The clientService must be added as a literal string in order to remain when the js is minified.
        controller: ["clientService", "arrayService", clientController],
        bindings: {
            "$router": "<",
            "clientid": "<"
        }
    });

    function clientController(clientService, arrayService) {

        var model = this;

        // When the component is activated (From client-list).
        // Load the data from the client, or create a blank form for a new client.
        model.$routerOnActivate = function (next) {
            // Takes the id from the parameters in the new url.
            loadClient(next.params.id);
        };

        model.$onChanges = function () {
            if (model.clientid) {
                // Takes the id from the component that is invoking this component.
                loadClient(model.clientid);

                // Nulls this variable so that it won't be listened any longer.
                model.clientid = null;
                // Disables several elements to remove some clutter from the reservation module.
                model.showReservations = false;
            }
        };

        var loadClient = function (id) {
            // The id might or might not exists, depending if it is a new client or not.
            if (id) {
                // Sets the id of the current client to be loaded.
                model.id = id;

                // Show reservations for this client.
                model.showReservations = true;

                // Calls the client service for a client by id.
                clientService.get(id)
                    // This call is asynchronous so a callback must be used in the promise to process the data.
                    .$promise.then(function (result) {
                        // Checks for errors...
                        if (!arrayService.errors(model, result, "ClientList")) {
                            model.name = result.results.name;
                            model.phones = result.results.phones;
                            model.created = new Date(result.results.created);

                            //Disable the form when an existing client is loaded.
                            model.disableForm = true;

                            // Enables the EDIT button.
                            model.editingClient = true;

                            // Changes the page main title.
                            model.title = "Detalles del Cliente";
                        }
                    });
            }
            else {
                // Do not show any reservations.
                model.showReservations = false;

                // Creates a blank form for a new client.
                model.name = "";
                model.phones = [""];
                model.created = new Date();

                // Enables the form if no client is loaded.
                model.disableForm = false;

                // Changes the page main title.
                model.title = "Nuevo Cliente";
            }
        };

        // Creates a new client and sends it as paramter for the save function.
        model.saveClient = function (valid) {
            if (valid) {
                var client = {
                    _id: model.id,
                    name: model.name,
                    phones: model.phones,
                    created: model.created
                };

                clientService.save(client).$promise
                    // Success (can still contain schema errors and such).
                    .then(function (response) {
                        // Checks for errors...
                        if (!arrayService.errors(model, response, "ClientList")) {

                            arrayService.pop("success",
                                true,
                                "Cliente guardado con exito!",
                                // Sets the custom action to perform when saving a client.
                                function () {
                                    angular.element('#myModal').attr("class", "");
                                    angular.element('#myModal').modal('hide');
                                    // Programatically navigates to the ClientList component.
                                    model.$router.navigate(["ClientList"]);
                                },
                                function () { },
                                model);
                            $('#myModal').modal('show');
                        }
                    })
                    // Unexpected errors.
                    .catch(function (response) {
                        console.log("Error:", response.errors);
                        arrayService.pop("error",
                            true,
                            "Ha ocurrido un error.",
                            // Sets the custom action to perform when saving a client.
                            function () {
                                // Programatically navigates to the ClientList component.
                                model.$router.navigate(["ClientList"]);
                            },
                            function () { },
                            model);
                    });
            }
        };

        model.editClient = function () {
            // Enables the form in order for the user to update the client.
            model.disableForm = false;

            // Hides the EDIT button.
            model.editingClient = false;
        };

        model.cancelEdit = function () {
            arrayService.pop("confirm",
                true,
                "Esta seguro que desea cancelar? Perdera los cambios.",
                // Sets the custom action to perform when canceling.
                function () {
                    angular.element('#myModal').attr("class", "");
                    angular.element('#myModal').modal('hide');
                    model.$router.navigate(["ClientList"]);
                },
                function () {
                    model.disableForm = model.editingClient;
                },
                model);
            $('#myModal').modal('show');

            //angular.element('#myModal').attr("visible", false);
        };
    }

}());
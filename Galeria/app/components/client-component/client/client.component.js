(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("clientComponent", {
        templateUrl: "/components/client-component/client/client.component.html",
        controllerAs: "model",
        //The clientService must be added as a literal string in order to remain when the js is minified.
        controller: ["clientService", clientController],
        bindings: {
            "$router": "<"
        }
    });

    function clientController(clientService) {

        var model = this;

        // When the component is activated (From client-list).
        // Load the data from the client, or create a blank form for a new client.
        model.$routerOnActivate = function (next) {

            // Takes the id from the parameters in the new url.
            if (next.params.id) {
                // Calls the client service for a client by id.
                clientService.get(next.params.id)
                    // This call is asynchronous so a callback must be used in the promise to process the data.
                    .$promise.then(function (result) {
                        model.id = result.results._id;
                        model.name = result.results.name;
                        model.phones = result.results.phones;
                        model.created = new Date(result.results.created);

                        //Disable the form when an existing client is loaded.
                        model.disableForm = true;

                        // Enables the EDIT button.
                        model.editingClient = true;

                        // Changes the page main title.
                        model.title = "Detalles del Cliente";
                    });
            }
            else {
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

        model.$onInit = function () {
        };

        // Creates a new client and sends it as paramter for the save function.
        model.saveClient = function () {
            var client = {
                _id: model.id,
                name: model.name,
                phones: model.phones,
                created: model.created
            };

            clientService.save(client).$promise
                .then(function (response) {
                    popUp(true,
                        "Cliente guardado con exito!",
                        // Sets the custom action to perform when saving a client.
                        function () {
                            // Programatically navigates to the ClientList component.
                            model.$router.navigate(["ClientList"]);
                        });
                })
                .catch(function (response) {
                    console.log("Error:", response.errors);
                    popUp(true,
                        "Ha ocurrido un error.",
                        // Sets the custom action to perform when saving a client.
                        function () {
                            // Programatically navigates to the ClientList component.
                            model.$router.navigate(["ClientList"]);
                        });
                });
        };

        model.editClient = function () {
            // Enables the form in order for the user to update the client.
            model.disableForm = false;

            // Hides the EDIT button.
            model.editingClient = false;
        };

        model.cancel = function () {
            popUp(true,
                "Esta seguro que desea cancelar? Perdera los cambios.",
                // Sets the custom action to perform when canceling.
                function () {
                    model.$router.navigate(["ClientList"]);
                });
        };

        // Pop up message component. The model.pop property allows the form to hide the buttons when displaying the popup. 
        // This mechanism might not be required once styles are put in.
        var popUp = function (pop, message, confirm) {
            model.message = message;
            model.pop = pop;
            model.disableForm = true;
            model.confirm = confirm;
        };
    }

} ());
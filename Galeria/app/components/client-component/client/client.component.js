(function () {

    "use strict";

    var module = angular.module("theGallery");

    console.log("Creating client component...");
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
                        model.id = result.id;
                        model.name = result.name;
                        model.phones = result.phones;
                        model.created = new Date(result.created);

                        //Disable the form when an existing client is loaded.
                        model.disableForm = true;
                    });
            }
            else {
                // Creates a blank form for a new client.
                model.name = "";
                model.phones = [""];
                model.created = new Date();
                console.log(Date.now);

                // Enables the form if no client is loaded.
                model.disableForm = false;
            }
        };

        model.$onInit = function () {
        };

        // Adds a new empty string to the phones array in order to display a new input.
        model.addNewClientPhone = function () {
            model.phones.push("");
        };

        // Removes the selected phone from the array, the display is updated by removing an input.
        model.removeNewClientPhone = function (index) {
            model.phones.splice(index, 1);
        };

        // Updates the value for a specific phone in the array.
        model.savePhone = function (index, phone) {
            model.phones[index] = phone;
        };

        // Creates a new client and sends it as paramter for the save function.
        model.addNewClient = function () {
            var client = {
                name: model.name,
                phones: model.phones,
                created: model.created
            };

            console.log("client.component: Saving client...");
            clientService.save(client);

            // Programatically navigates to the ClientList component.
            model.$router.navigate(["ClientList"]);
        };
    }

} ());
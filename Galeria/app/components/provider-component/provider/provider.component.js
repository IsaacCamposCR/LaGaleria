(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("providerComponent", {
        templateUrl: "/components/provider-component/provider/provider.component.html",
        controllerAs: "model",
        //The providerService must be added as a literal string in order to remain when the js is minified.
        controller: ["providerService", providerController],
        bindings: {
            "$router": "<"
        }
    });

    function providerController(providerService) {
        var model = this;

        // When the component is activated (From provider-list).
        // Load the data from the provider, or create a blank form for a new provider.
        model.$routerOnActivate = function (next) {

            // Takes the id from the parameters in the new url.
            if (next.params.id) {
                // Calls the provider service for a provider by id.
                providerService.get(next.params.id).$promise.then(function (response) {
                    model.id = response.results._id;
                    model.name = response.results.name;
                    model.phones = response.results.phones;

                    //Disable the form when an existing provider is loaded.
                    model.disableForm = true;

                    // Enables the EDIT button.
                    model.editingProvider = true;

                    // Changes the page main title.
                    model.title = "Detalles del Proveedor";
                });
            } else {
                // Creates a blank form for a new provider.
                model.name = "";
                model.phones = [];

                // Enables the form if no provider is loaded.
                model.disableForm = false;

                // Changes the page main title.
                model.title = "Nuevo Proveedor";
            }
        };

        // Creates a new provider and sends it as paramter for the save function.
        model.saveProvider = function () {
            var provider = {
                _id: model.id,
                name: model.name,
                phones: model.phones
            };

            providerService.save(provider).$promise
                .then(function (response) {
                    popUp(true,
                        "Proveedor guardado con exito!",
                        // Sets the custom action to perform when saving a provider.
                        function () {
                            // Programatically navigates to the ProviderList component.
                            model.$router.navigate(["ProviderList"]);
                        });
                })
                .catch(function (response) {
                    console.log(response.errors);
                    popUp(true,
                        "Ha ocurrido un error...",
                        // Sets the custom action to perform when saving a provider.
                        function () {
                            // Programatically navigates to the ProviderList component.
                            model.$router.navigate(["ProviderList"]);
                        });
                });
        };

        model.editProvider = function () {
            // Enables the form in order for the user to update the provider.
            model.editingProvider = false;
            
            // Hides the EDIT button.
            model.disableForm = false;
        };

        model.cancel = function () {
            popUp(true,
                "Esta seguro que desea cancelar? Perdera los cambios.",
                // Sets the custom action to perform when canceling.
                function () {
                    model.$router.navigate(["ProviderList"]);
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
(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("providerComponent", {
        templateUrl: "/components/provider-component/provider/provider.component.html",
        controllerAs: "model",
        controller: ["providerService", providerController],
        bindings: {
            "$router": "<"
        }
    });

    function providerController(providerService) {
        var model = this;

        model.$routerOnActivate = function (next) {
            if (next.params.id) {

            } else {
                // Creates a blank form for a new provider.
                model.name = "";
                model.phones = [];

                model.disableForm = false;

                model.title = "Nuevo Proveedor";
            }
        };

        model.saveProvider = function () {
            var provider = {
                name: model.name,
                phones: model.phones
            };

            providerService.save(provider).$promise
                .then(function (response) {
                    popUp(true, "Proveedor guardado con exito!", function () { });
                })
                .catch(function (response) {
                    popUp(true, "Ha ocurrido un error...", function () { });
                });
        };

        // Pop up message component. The model.pop property allows the form to hide the buttons when displaying the popup. 
        // This mechanism might not be required once styles are put in.
        var popUp = function (pop, message, confirm) {
            model.message = message;
            model.pop = pop;
            model.disableForm = true;
            model.confirm = confirm;
            model.$router.navigate(["Provider"]);
        };
    }
} ());
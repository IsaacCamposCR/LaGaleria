(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("phones", {
        templateUrl: "/components/phones-component/phones.component.html",
        controllerAs: "model",
        controller: [phonesController],
        bindings: {
            "phones": "="
        }
    });

    function phonesController() {
        var model = this;

        // Updates the value for a specific phone in the array.
        model.savePhone = function (index, phone) {
            model.phones[index] = phone;
        };

        // Removes the selected phone from the array, the display is updated by removing an input.
        model.removeNewClientPhone = function (index) {
            if (model.phones.length === 1) {
                popUp(true,
                    "Debe ingresar al menos un numero de telefono...",
                    // Sets the custom action to perform when deleting phone numbers.
                    function () {
                    });
            }
            else {
                model.phones.splice(index, 1);
            }
        };

        // Adds a new empty string to the phones array in order to display a new input.
        model.addNewClientPhone = function () {
            if (model.phones[model.phones.length - 1] === "") {
                popUp(true,
                    "Debe proveer primero el telefono anterior.",
                    function () { });
            }
            else {
                model.phones.push("");
            }
        };

        // Pop up message component. The model.pop property allows the form to hide the buttons when displaying the popup. 
        // This mechanism might not be required once styles are put in.
        var popUp = function (pop, message, confirm) {
            model.message = message;
            model.pop = pop;
        };

    }
} ());
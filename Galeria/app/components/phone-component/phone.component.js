(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("phone", {
        templateUrl: "/components/phone-component/phone.component.hmtl",
        controllerAs: "model",
        controller: [phoneController],
        bindings: {
            "phones": "="
        }
    });

    function phoneController() {
        var model = this;

        // Updates the value for a specific phone in the array.
        model.savePhone = function (index, phone) {
            model.phones[index] = phone;
        };

        // Removes the selected phone from the array, the display is updated by removing an input.
        model.removeNewClientPhone = function (index) {
            if (model.phones.length === 1) {
                popUp(true,
                    "El cliente debe contener al menos un numero de telefono...",
                    // Sets the custom action to perform when deleting phone numbers.
                    function () {
                        model.disableForm = false;
                    });
            }
            else {
                model.phones.splice(index, 1);
            }
        };

        // Adds a new empty string to the phones array in order to display a new input.
        model.addNewClientPhone = function () {
            model.phones.push("");
        };
    }

} ());
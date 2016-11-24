(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("advanceComponent", {
        templateUrl: "/components/advance-component/advance.component.html",
        controllerAs: "model",
        controller: [advanceController],
        bindings: {
            "advances": "=",
            "remaining": "<",
            "displayTotals": "&"
        }
    });

    function advanceController() {

        var model = this;

        model.$onInit = function () {
            model.advances = [];
            model.advanceAmount = 0;
            model.advanceDate = new Date();
            model.disableForm = false;
        };

        // When an advance is added, push the item to the advances array, clean the form, and update totals.
        model.addAdvance = function () {

            if (model.advanceAmount > model.remaining) {
                popUp("error",
                    true,
                    "El monto no puede ser mayor al Saldo.",
                    function () {
                        model.disableForm = false;
                    });
                return;
            }

            if (model.advanceAmount <= 0) {
                popUp("error",
                    true,
                    "El monto no puede ser menor o igual a 0",
                    function () {
                        model.disableForm = false;
                    });
                return;
            }

            model.advances.push({
                amount: model.advanceAmount,
                date: model.advanceDate
            });

            model.advanceAmount = 0;
            model.advanceDate = new Date();

            model.displayTotals();
        };


        // Remove the advance from the array and update totals.
        model.removeAdvance = function (index) {
            model.advances.splice(index, 1);
            
            model.displayTotals();
        };

        // Pop up message component. The model.pop property allows the form to hide the buttons when displaying the popup. 
        // This mechanism might not be required once styles are put in.
        var popUp = function (type, pop, message, confirm, cancel) {
            model.messageType = type;
            model.message = message;
            model.pop = pop;
            model.disableForm = true;
            model.confirm = confirm;
            if (cancel) {
                model.cancel = cancel;
            }
        };
    }

} ());
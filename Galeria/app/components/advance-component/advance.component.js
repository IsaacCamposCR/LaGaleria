(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("advanceComponent", {
        templateUrl: "/components/advance-component/advance.component.html",
        controllerAs: "model",
        controller: ["arrayService", advanceController],
        bindings: {
            "advances": "=",
            "remaining": "<",
            "displayTotals": "&"
        }
    });

    function advanceController(arrayService) {

        var model = this;

        model.$onInit = function () {
            model.advances = [];
            model.advanceAmount = 0;
            model.advanceDate = new Date();
            model.disableForm = false;
        };

        // When an advance is added, push the item to the advances array, clean the form, and update totals.
        model.addAdvance = function () {

            if (arrayService.unformat(model.advanceAmount) > arrayService.unformat(model.remaining)) {
                arrayService.pop("error",
                    true,
                    "El monto no puede ser mayor al Saldo.",
                    function () {
                        model.disableForm = false;
                    },
                    model);
                return;
            }

            if (arrayService.unformat(model.advanceAmount) <= 0) {
                arrayService.pop("error",
                    true,
                    "El monto no puede ser menor o igual a 0",
                    function () {
                        model.disableForm = false;
                    },
                    model);
                return;
            }

            model.advances.push({
                amount: arrayService.unformat(model.advanceAmount),
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
    }

} ());
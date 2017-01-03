(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("moneyInput", {
        templateUrl: "/components/money-input-component/money-input-component.html",
        controllerAs: "model",
        controller: ["arrayService", moneyInputController],
        bindings: {
            text: "=",
            blur: "&"
        }
    });

    function moneyInputController(arrayService) {
        var model = this;

        model.$onInit = function () {
            model.text = "0";
        };

        model.$onChanges = function (changesObj) {
            if (model.text) {
                model.format();
            }
        };

        model.format = function () {
            model.text = arrayService.unformat(model.text);

            // Gets the absolute value in order to remove leading zeros.
            model.text = !model.text ? '' : Math.abs(model.text);

            model.text = String(model.text).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        };

        model.supressKeys = function ($event) {
            // Number keys.
            if (($event.keyCode < 48) || ($event.keyCode > 57)) {
                // Backspace and Delete keys.
                if ($event.keyCode !== 8 && $event.keyCode !== 46) {
                    $event.preventDefault();
                }
            }
        };
    }
} ());
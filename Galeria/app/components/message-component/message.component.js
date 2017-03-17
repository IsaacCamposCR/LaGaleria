(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("message", {
        templateUrl: "/components/message-component/message.component.html",
        controllerAs: "model",
        controller: [messageController],
        bindings: {
            show: "=",
            type: "=",
            message: "<",
            confirm: "&",
            cancel: "&"
        }
    });

    function messageController() {
        var model = this;

        model.$onInit = function () {
        }

        model.$onChanges = function () {

            // Hides and shows controls depending on the modal type.
            switch (model.type) {
                // If the user needs to confirm or cancel an action.
                case "confirm":
                    model.title = "CONFIRMAR";
                    model.headingClass = "panel-default";
                    model.cancelButton = true;
                    break;
                // If the message will be displayed without confirmation required.
                case "success":
                    model.title = "EXITO";
                    model.headingClass = "panel-success";
                    model.cancelButton = false;
                    break;
                case "error":
                    model.title = "ERROR";
                    model.headingClass = "panel-danger";
                    model.cancelButton = false;
                    break;
                case "warning":
                    model.title = "ATENCION";
                    model.headingClass = "panel-success";
                    model.cancelButton = true;
                    break;
                default:
                    model.cancelButton = false;
                    break;
            }
        };

        model.confirmMessage = function () {
            model.show = false;
            model.confirm();
        };

        model.cancelMessage = function () {
            model.show = false;
            model.cancel();
        };
    }

}());
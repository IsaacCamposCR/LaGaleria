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

        model.$onChanges = function () {
            // Hides and shows controls depending on the modal type.
            switch (model.type) {
                // If the user needs to confirm or cancel an action.
                case "confirm":
                    model.cancelButton = true;
                    break;
                // If the message will be displayed without confirmation required.
                case "success":
                    model.cancelButton = false;
                    break;
                case "error":
                    model.cancelButton = false;
                    break;
                case "warning":
                    model.cancelButton = true;
                    break;
                default:
                    model.cancelButton = false;
                    break;
            }
        };

        model.confirmMessage = function () {
            model.show = false;
            angular.element('#myModal').attr("class", "");
            angular.element('#myModal').modal('hide');
            model.confirm();
        };

        model.cancelMessage = function () {
            model.show = false;
            model.cancel();
        };
    }

}());
(function () {

    "use strict";

    var module = angular.module("theGallery");

    console.log("Registering message component");
    module.component("message", {
        templateUrl: "/components/message-component/message.component.html",
        controllerAs: "model",
        controller: [messageController],
        bindings: {
            message: "<",
            confirm: "&"
        }
    });

    function messageController() {
        var model = this;

        model.ok = function () {
            model.confirm();
        };
    }
} ());
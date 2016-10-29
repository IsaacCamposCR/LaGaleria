(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("message", {
        templateUrl: "/components/message-component/message.component.html",
        controllerAs: "model",
        controller: [messageController],
        bindings: {
            show: "=",
            message: "<",
            confirm: "&"
        }
    });

    function messageController() {
        var model = this;

        model.ok = function () {
            model.show = false;
            model.confirm();
        };
    }
} ());
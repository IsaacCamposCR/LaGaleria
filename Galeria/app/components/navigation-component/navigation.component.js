(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("navigation", {
        templateUrl: "/components/navigation-component/navigation.component.html",
        controllerAs: "model",
        controller: [navigationController],
        bindings: {
            "$router": "<"
        }
    });

    function navigationController() {
        var model = this;
    }
})();
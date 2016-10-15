"use strict";

galleryApp.directive("newClient", function () {
    console.log("Registering newClient directive...");
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/templates/directives/app.template.directive.newClient.html",
        scope: {
            client: "=client"
        }
    };
});
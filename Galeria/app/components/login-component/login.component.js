(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("loginComponent", {
        templateUrl: "/components/login-component/login.component.html",
        controllerAs: "model",
        //The services must be added as a literal strings in order to remain when the js is minified.
        controller: ["userService", "arrayService", loginController],
        bindings: {
            "$router": "<"
        }
    });

    function loginController(userService, arrayService) {
        var model = this;

        model.$onInit = function () {

        };

        model.login = function () {
            userService.login({ username: model.username, password: model.password }).$promise
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (response) {
                    console.log("Error:", response.errors);
                    arrayService.pop("error",
                        true,
                        "Ha ocurrido un error.",
                        // Sets the custom action to perform when saving a client.
                        function () {
                            // Programatically navigates to the ClientList component.
                            model.$router.navigate(["Login"]);
                        },
                        function () { },
                        model);
                });
        };
    }
})();
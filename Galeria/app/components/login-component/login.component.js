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
                    if (response.errors) {
                        arrayService.pop("error",
                            true,
                            response.errors,
                            // Sets the custom action to perform when saving a client.
                            function () { },
                            function () { },
                            model);
                        $('#myModal').modal('show');
                    }
                    else {
                        storeToken(response.results);
                        // Programatically navigates to the Main component.
                        model.$router.navigate(["Main"]);
                    }
                })
                .catch(function (response) {
                    console.log("Error:", response.errors);
                    arrayService.pop("error",
                        true,
                        "Ha ocurrido un error.",
                        // Sets the custom action to perform when saving a client.
                        function () {
                            // Programatically navigates to the Login component.
                            model.$router.navigate(["Login"]);
                        },
                        function () { },
                        model);
                    $('#myModal').modal('show');
                });
        };

        model.newUser = function () {
            userService.save({ username: model.username, name: "Hi", password: model.password }).$promise
                .then(function (response) {
                    if (response.errors) {
                        arrayService.pop("error",
                            true,
                            response.errors,
                            // Sets the custom action to perform when saving a client.
                            function () { },
                            function () { },
                            model);
                        $('#myModal').modal('show');
                    }
                    else {
                        arrayService.pop("success",
                            true,
                            "Usuario creado con exito!",
                            // Sets the custom action to perform when saving a client.
                            function () { },
                            function () { },
                            model);
                        $('#myModal').modal('show');
                    }
                });
        };

        var storeToken = function (token) {
            if (typeof (Storage) !== "undefined") {
                // Code for localStorage/sessionStorage.
                sessionStorage.setItem("jsonWebToken", token);
            } else {
                // Sorry! No Web Storage support..
                arrayService.pop("error",
                    true,
                    "Debe utilizar un navegador mas reciente!",
                    // Sets the custom action to perform when saving a client.
                    function () { },
                    function () { },
                    model);
                $('#myModal').modal('show');
            }
        };
    }
})();
(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.factory("userService", function ($resource) {

        var resource = $resource("/api/login");
        var userResource = $resource("/api/user/");

        var loginUser = function (user) {

            // Posts the data to the endpoint, asynchronous.
            return resource.save(user);
        };

        var saveUser = function (user) {

            // Posts the data to the endpoint, asynchronous.
            return userResource.save(user);
        };

        return {
            login: loginUser,
            save: saveUser
        };

    });
})();
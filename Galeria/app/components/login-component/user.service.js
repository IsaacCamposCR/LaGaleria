(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.factory("userService", function ($resource) {

        var resource = $resource("/api/login");

        var loginUser = function (user) {

            // Posts the data to the endpoint, asynchronous.
            return resource.save(user);
        };

        return {
            login: loginUser
        };

    });
})();
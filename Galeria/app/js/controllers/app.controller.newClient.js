"use strict";

galleryApp.controller("NewClientController",
    function NewClientController($scope) {

        $scope.client = {
            clientName: "",
            clientPhones: [""]
        };

        $scope.addNewClientPhone = function () {
            $scope.client.clientPhones.push("");
        };

        $scope.removeNewClientPhone = function (index) {
            $scope.client.clientPhones.splice(index, 1);
        }

        $scope.savePhone = function (index, phone) {
            $scope.client.clientPhones[index] = phone;
        };

        $scope.addNewClient = function () {
        };

        $scope.cancel = function () {

        };
    }
);
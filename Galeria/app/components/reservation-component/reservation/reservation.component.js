(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("reservationComponent", {
        templateUrl: "/components/reservation-component/reservation/reservation.component.html",
        controllerAs: "model",
        controller: [reservationController],
        bindings: {

        }
    });

    function reservationController() {
        var model = this;

        model.$onInit = function () {


            model.articles = [
                {
                    id: "8767567fhgfhj",
                    category: "Angeles",
                    name: "Angel Pequeno",
                    price: "3000",
                    stock: 3
                }
            ];
        };

        model.beginClientSearch = function () {
            model.clients = [
                {
                    id: "5454hhfuyf6",
                    name: "Juanito Perez",
                    phone: "22625485"
                },
                {
                    id: "876hjghf6ji",
                    name: "Fulana de Tal",
                    phone: "83093019"
                }
            ];

            model.lookupClient = true;
        };

        model.endClientSearch = function () {
            model.lookupClient = false;
        };

        model.selectClient = function (id) {
            model.client = lookupItemFromArray(id, model.clients).name;
            model.lookupClient = false;
        };

        model.selectArticle = function (id) {
            model.article = lookupItemFromArray(id, model.articles).name;
        };

        // Looks up the model.categories array to select the one with a certain id.
        var lookupItemFromArray = function (id, array) {
            // The filter function is not supported on older browsers...
            var result = array.filter(function (item) {
                return item.id == id;
            });
            return result[0];
        };
    }

} ());
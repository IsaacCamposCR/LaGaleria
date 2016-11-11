(function () {
    "use strict";

    var module = angular.module("theGallery");

    module.component("galleryApp", {
        templateUrl: "/components/gallery-app.component.html",
        // Creates all the component routes.
        $routeConfig: [
            { path: "/error", component: "messageComponent", name: "Message" },

            { path: "/phones", component: "phonesComponent", name: "Phones" },

            { path: "/calculadora", component: "artCalculatorComponent", name: "ArtCalculator" },

            { path: "/cliente", component: "clientComponent", name: "Client" },
            { path: "/cliente/:id", component: "clientComponent", name: "EditClient" },
            { path: "/clientes", component: "clientListComponent", name: "ClientList" },

            { path: "/articulo", component: "articleComponent", name: "Article" },
            { path: "/articulo/:id", component: "articleComponent", name: "EditArticle" },
            { path: "/inventario", component: "inventoryComponent", name: "Inventory" },

            { path: "/proveedor", component: "providerComponent", name: "Provider" },
            { path: "/proveedor/:id", component: "providerComponent", name: "EditProvider" },
            { path: "/proveedores", component: "providerListComponent", name: "ProviderList" },

            { path: "/apartado", component: "reservationComponent", name: "Reservation" },
            { path: "/apartado/:id", component: "reservationComponent", name: "EditReservation" },
            { path: "/apartados", component: "reservationListComponent", name: "ReservationList" },

            { path: "/**", redirectTo: ["ArtCalculator"] }
        ]
    });
} ());
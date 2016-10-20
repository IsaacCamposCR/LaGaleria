(function () {
    "use strict";

    var module = angular.module("theGallery");

    console.log("Defining galleryApp component...");
    module.component("galleryApp", {
        templateUrl: "/components/gallery-app.component.html",
        // Creates all the component routes.
        $routeConfig: [            
            { path: "/calculadora", component: "artCalculatorComponent", name: "ArtCalculator" },

            { path: "/cliente", component: "clientComponent", name: "Client" },
            { path: "/cliente/:id", component: "clientComponent", name: "EditClient" },
            { path: "/clientes", component: "clientListComponent", name: "ClientList" },

            { path: "/articulo", component: "articleComponent", name: "Article" },
            { path: "/articulo/:id", component: "articleComponent", name: "EditArticle" },
            { path: "/inventario", component: "inventoryComponent", name: "Inventory" },
            
            { path: "/**", redirectTo: ["ArtCalculator"] }
        ]
    });
} ());
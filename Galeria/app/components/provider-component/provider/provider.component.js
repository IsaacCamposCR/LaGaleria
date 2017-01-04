(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.component("providerComponent", {
        templateUrl: "/components/provider-component/provider/provider.component.html",
        controllerAs: "model",
        //The providerService must be added as a literal string in order to remain when the js is minified.
        controller: ["providerService", "arrayService", providerController],
        bindings: {
            "$router": "<"
        }
    });

    function providerController(providerService, arrayService) {
        var model = this;

        // When the component is activated (From provider-list).
        // Load the data from the provider, or create a blank form for a new provider.
        model.$routerOnActivate = function (next) {

            // Takes the id from the parameters in the new url.
            if (next.params.id) {
                loadProvider(next.params.id);
            } else {
                newProvider();
            }
        };

        var loadProvider = function (id) {
            // Calls the provider service for a provider by id.
            providerService.get(id).$promise.then(function (response) {
                //Checks for errors...
                if (!arrayService.errors(model, response, "ProviderList")) {

                    model.id = response.results._id;
                    model.name = response.results.name;
                    model.phones = response.results.phones;

                    // Creates the types array for invoices.
                    model.invoiceTypes = ["Factura", "Recibo"];
                    model.cancelInvoice();

                    //Disable the form when an existing provider is loaded.
                    model.disableForm = true;

                    // Enables the EDIT button.
                    model.editingProvider = true;

                    // Changes the page main title.
                    model.title = "Detalles del Proveedor";

                    //Hides the new invoice form
                    model.newInvoice = false;

                    loadInvoices(id);
                }
            });
        };

        var newProvider = function () {
            // Creates a blank form for a new provider.
            model.name = "";
            model.phones = [];

            // Enables the form if no provider is loaded.
            model.disableForm = false;

            // Changes the page main title.
            model.title = "Nuevo Proveedor";
        };

        var loadInvoices = function (id) {
            var balance = 0;
            model.invoices = [];

            providerService.invoice(id).$promise
                .then(function (result) {
                    // Checks for errors...
                    if (!arrayService.errors(model, result, "ProviderList")) {

                        result.results.forEach(function (item) {
                            if (item.type) {
                                // If the document is an invoice sums the amount to the balance.
                                balance += item.amount;
                                item.type = "Factura";
                            } else {
                                // If the document is a receipt substract the amout from the balance.
                                balance -= item.amount;
                                item.type = "Recibo";
                            }
                            item.balance = balance;

                            model.invoices.push(item);
                        });
                    }
                });
        };

        // Creates a new provider and sends it as paramter for the save function.
        model.saveProvider = function () {
            // Creates a provider object.
            var provider = {
                _id: model.id,
                name: model.name,
                phones: model.phones
            };

            // Calls the provider service to save the provider.
            providerService.save(provider).$promise
                .then(function (response) {
                    // Checks for errors...
                    if (!arrayService.errors(model, response, "ProviderList")) {

                        arrayService.pop("success",
                            true,
                            "Proveedor guardado con exito!",
                            // Sets the custom action to perform when saving a provider.
                            function () {
                                model.$router.navigate(["ProviderList"]);
                            },
                            function () { },
                            model);
                    }
                })
                .catch(function (response) {
                    arrayService.pop("error",
                        true,
                        "Ha ocurrido un error...",
                        // Sets the custom action to perform when saving a provider.
                        function () {
                            // Programatically navigates to the ProviderList component.
                            model.$router.navigate(["ProviderList"]);
                        },
                        function () { },
                        model);
                });
        };

        // Displays the invoice form to insert a new one.
        model.invoiceForm = function () {
            model.newInvoice = !model.newInvoice;
        };

        // Brings up the new invoice panel.
        model.addInvoice = function () {

            // Sets the invoice type to bool before saving.
            model.invoiceType = (model.selectedInvoiceType === model.invoiceTypes[0]) ? true : false;

            // Creates an invoice array item.
            var invoice = [{
                _id: model.id,
                number: model.invoiceNumber,
                amount: arrayService.unformat(model.invoiceAmount),
                date: model.invoiceDate,
                due: model.invoiceDueDate,
                type: model.invoiceType
            }];

            // Pushes the invoice to the existing provider.
            // This is actually an UPDATE procedure.
            providerService.add(invoice).$promise
                .then(function (response) {
                    // Checks for errors...
                    if (!arrayService.errors(model, response, "ProviderList")) {

                        // Message to display a successful invoice push.
                        arrayService.pop("success",
                            true,
                            ((model.invoiceType) ?
                                "La Factura ha sido agregada" :
                                "El Recibo ha sido agregado") +
                            " con exito!",
                            function () {
                                model.cancelInvoice();
                            },
                            function () { },
                            model);
                        // Reloads the invoices from Mongo.
                        loadInvoices(model.id);
                    }
                })
                .catch(function (response) {
                    console.log("Error", response.errors);
                    arrayService.pop("error",
                        true,
                        "Ha ocurrido un error...",
                        function () { },
                        function () { },
                        model);
                });
        };

        model.cancelInvoice = function () {
            // Clean the invoice form.
            model.selectedInvoiceType = model.invoiceTypes[0];
            model.invoiceNumber = "";
            model.invoiceAmount = "";
            model.invoiceDate = new Date();
            model.invoiceDueDate = new Date();
        };

        model.editProvider = function () {
            // Enables the form in order for the user to update the provider.
            model.editingProvider = false;

            // Hides the EDIT button.
            model.disableForm = false;
        };

        model.cancelEdit = function () {
            arrayService.pop("confirm",
                true,
                "Esta seguro que desea cancelar? Perdera los cambios.",
                // Sets the custom action to perform when canceling.
                function () {
                    model.$router.navigate(["ProviderList"]);
                },
                function () {
                    model.disableForm = model.editingProvider;
                },
                model);
        };
    }
} ());
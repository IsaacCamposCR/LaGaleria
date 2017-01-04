(function () {

    "use strict";

    var module = angular.module("theGallery");

    module.factory("arrayService", function () {
        var lookupItemFromArray = function (id, array) {
            // The filter function is not supported on older browsers...
            var result = array.filter(function (item) {
                return item._id == id;
            });
            return result;
        };

        var pushItemIntoArray = function (item, array) {
            // If the _id exists in the item to be added it will need to be validated.
            if (item._id) {
                // If the _id does not exist in the array, push the item.
                if (!(lookupItemFromArray(item._id, array)[0])) {
                    array.push(item);
                }
            }
            // If there's no _id do not validate, just add.
            else {
                array.push(item);
            }
        };

        var sortArrayItems = function (orderBy, column) {
            if (orderBy.includes("+" + column)) {
                return "-" + column;
            }
            else {
                return "+" + column;
            }
        };

        var formatStringIntoNumber = function (formattedNumber) {
            var unformattedNumber = String(formattedNumber).split(",").join("");
            return Number(unformattedNumber);
        };

        // Wrapper function to determine if a certain response contains any errors, 
        // if it does, it displays the error, logs it and then stops execution.
        // If there are no errors, execution continues as normal.
        var responseHasErrors = function (model, response, redirect) {
            if (response.errors) {
                console.log("Error:", response.errors);
                var errorMessage = response.errors.code == 11000 ? "Esta ingresando un registro duplicado..." : response.errors.errmsg;
                popUp("error",
                    true,
                    ("Ha ocurrido un error: " + errorMessage),
                    // Sets the custom action to perform when saving a client.
                    function () {
                        // Programatically navigates to the ClientList component.
                        model.$router.navigate([redirect]);
                    },
                    model);
                return true;
            }
            else {
                return false;
            }
        };

        // Pop up message component. The model.pop property allows the form to hide the buttons when displaying the popup. 
        // This mechanism might not be required once styles are put in.
        var popUp = function (type, pop, message, confirm, cancel, model) {
            model.messageType = type;
            model.message = message;
            model.pop = pop;
            model.disableForm = true;
            model.confirm = confirm;
            if (cancel) {
                model.cancel = cancel;
            }
        };

        return {
            lookup: lookupItemFromArray,
            push: pushItemIntoArray,
            sort: sortArrayItems,
            unformat: formatStringIntoNumber,
            errors: responseHasErrors,
            pop: popUp
        };
    });

} ());
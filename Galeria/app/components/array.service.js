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

        return {
            lookup: lookupItemFromArray,
            push: pushItemIntoArray
        };
    });

} ());
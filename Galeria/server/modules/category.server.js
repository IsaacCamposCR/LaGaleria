// References the schema for categories.
var CategorySchema = require("../schemas/category.schema.js");

module.exports.save = function (req, res) {
    console.log("Saving category...");

    // Creates an instance of the category schema with the data from the request body.
    var category = new CategorySchema({
        category: req.body.category
    });

    // Executes the save command to Mongo.
    category.save(function (err) {
        if (err) {
            var errMsg = "Sorry, there was an error saving the category. " + err;
        }
        else {
            console.log("New category was saved!");
        }
    });
};

// Returns a single category by category property from the database.
module.exports.get = function (req, res) {
    console.log("exports.get: Finding by category");

    //Creates a new query to find a single category by category taken from the request parameters.
    var query = CategorySchema.find().where({ category: req.params.category });

    // Executes the findById query.
    query.exec(function (err, results) {
        if (err) {
            console.log("Errors");
            var errMsg = "Sorry, there was an error retrieving the client. " + err;
        }
        else {
            console.log("No errors");
            res.send(results);
            res.end();
        }
    });
};

module.exports.list = function (req, res) {
    console.log("category.list: Getting all categories...");

    // Creates a new query to find all categories and sort them ascendingly.
    var query = CategorySchema.find().select({ "category": 1, "_id": 0 });;
    query.sort({ category: "asc", description: "asc" });

    // Executes the find query.
    query.exec(function (err, results) {
        if (err) {
            console.log("Errors");
            var errMsg = "Sorry, there was an error retrieving the categories. " + err;
        }
        else {
            console.log("No errors");
            res.send(results);
            res.end();
        }
    });
};

module.exports.update = function (req, res) {
    console.log("category.update: Updating category...");
};
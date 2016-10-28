// References the schema for categories.
var CategorySchema = require("../schemas/category.schema.js");

var newCategory = function (req, res) {

    // Creates an instance of the category schema with the data from the request body.
    var category = new CategorySchema({
        category: req.body.categoryName
    });

    // Executes the save command to Mongo.
    category.save(function (err, results) {
        res.send({ results: results, errors: err });
        res.end();
    });
};

var updateCategory = function (req, res) {

    CategorySchema.update({ _id: req.body._id }, { category: req.body.categoryName }, { multi: false }, function (err, numAffected) {
        res.send({ results: req.body, errors: err });
        res.end();
    });
};

module.exports.save = function (req, res) {
    if (req.body._id) {
        updateCategory(req, res);
    } else {
        newCategory(req, res);
    }
};

// Returns a single category by category property from the database.
module.exports.get = function (req, res) {

    //Creates a new query to find a single category by category taken from the request parameters.
    var query = CategorySchema.find().where({ category: req.params.category });

    // Executes the findById query.
    query.exec(function (err, results) {
        res.send({ results: results, errors: err });
        res.end();
    });
};

module.exports.list = function (req, res) {

    // Creates a new query to find all categories and sort them ascendingly.
    var query = CategorySchema.find();//.select({ "category": 1, "_id": 0 });
    query.sort({ category: "asc" });

    // Executes the find query.
    query.exec(function (err, results) {
        res.send({ results: results, errors: err });
        res.end();
    });
};
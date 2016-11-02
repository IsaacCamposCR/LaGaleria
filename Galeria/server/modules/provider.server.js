// References the schema for providers
var ProviderSchema = require("../schemas/provider.schema.js");

var newProvider = function (req, res) {

    // Creates an instance of the provider schema with the data from the request body.
    var provider = new ProviderSchema({
        name: req.body.name,
        phones: req.body.phones,
        invoices: []
    });

    // Executes the save command to Mongo.
    provider.save(function (err) {
        res.send({ results: req.body, errors: err });
        res.end();
    });
};

var updateProvider = function (req, res) {
    // Query to select the appropriate provider by id.
    var query = {
        _id: req.body._id
    };

    // New data to be updated.
    var newData = {
        name: req.body.name,
        phones: req.body.phones
    };

    // Update executed according to query, new data, only one row.
    ProviderSchema.update(query, newData, { multi: false },
        function (err, numAffected) {
            res.send({ results: req.body, errors: err });
            res.end();
        });
};

module.exports.save = function (req, res) {
    // If the id parameter exists in the body, call update, else create a new record.
    if (req.body._id) {
        updateProvider(req, res);
    } else {
        newProvider(req, res);
    }
};

// Returns an object with an array of providers.
module.exports.list = function (req, res) {
    var query;

    if (req.query.name) {
        // Query to return a list of all the providers by name in the database.
        query = ProviderSchema.find({ "name": { "$regex": req.query.name, "$options": "i" } });
    } else {
        // Creates a new query to find all providers and sort them ascendingly.
        query = ProviderSchema.find();
    }

    query.sort({ name: "asc" });

    // Executes the find query.
    query.exec(function (err, results) {
        res.send({ results: results, errors: err });
        res.end();
    });
};

module.exports.get = function (req, res) {
    //Creates a new query to find a single provider by _id taken from the request parameters.
    var query = ProviderSchema.findById(req.params.id);

    // Executes the findById query.
    query.exec(function (err, results) {
        res.send({ results: results, errors: err });
        res.end();
    });
};
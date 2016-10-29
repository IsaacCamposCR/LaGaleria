// References the schema for clients
var ClientSchema = require("../schemas/client.schema.js");

var newClient = function (req, res) {

    // Creates an instance of the client schema with the data from the request body.
    var client = new ClientSchema({
        name: req.body.name,
        phones: req.body.phones,
        created: req.body.created
    });

    // Executes the save command to Mongo.
    client.save(function (err) {
        res.send({ results: req.body, errors: err });
        res.end();
    });
};

var updateClient = function (req, res) {

    var query = {
        _id: req.body._id
    };

    var newData = {
        name: req.body.name,
        phones: req.body.phones,
        created: req.body.created
    };

    ClientSchema.update(query, newData, { multi: false },
        function (err, numAffected) {
            res.send({ results: req.body, errors: err });
            res.end();
        });
};

// Creates a new client object in the database.
module.exports.save = function (req, res) {
    if (req.body._id) {
        updateClient(req, res);
    } else {
        newClient(req, res);
    }
};

module.exports.list = function (req, res) {
    var query;

    if (req.query.name) {
        // Query to return a list of all the clients by name in the database.
        query = ClientSchema.find({ 'name': { "$regex": req.query.name, "$options": "i" } });
    } else {
        // Creates a new query to find all clients and sort them ascendingly.
        query = ClientSchema.find().sort({ name: "asc" });
    }

    // Executes the find query.
    query.exec(function (err, results) {
        res.send({ results: results, errors: err });
        res.end();
    });
};

// Returns a single client by _id property from the database.
module.exports.get = function (req, res) {

    //Creates a new query to find a single client by _id taken from the request parameters.
    var query = ClientSchema.findById(req.params.id);

    // Executes the findById query.
    query.exec(function (err, results) {
        res.send({ results: results, errors: err });
        res.end();
    });
};
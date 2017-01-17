// References the schema for clients
var ClientSchema = require("../schemas/client.schema.js");

// Creates a new client object in the database.
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

// Updates an existing client object in the database.
var updateClient = function (req, res) {
    // Query to select the appropriate client by id.
    var query = {
        _id: req.body._id
    };

    // New data to be updated.
    var newData = {
        name: req.body.name,
        phones: req.body.phones,
        created: req.body.created
    };

    // Update executed according to query, new data, only one row.
    ClientSchema.update(query, newData, { multi: false },
        function (err, numAffected) {
            res.send({ results: req.body, errors: err });
            res.end();
        });
};

module.exports.save = function (req, res) {
    // If the _id parameter in the body exists then calls update, else it creates a new record.
    if (req.body._id) {
        updateClient(req, res);
    } else {
        newClient(req, res);
    }
};

// Returns an object with an array of clients.
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
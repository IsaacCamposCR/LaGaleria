// References the schema for clients
var ClientSchema = require("../schemas/client.schema.js");

// Creates a new client object in the database.
module.exports.save = function (req, res) {
    console.log("Saving client...");

    // Creates an instance of the client schema with the data from the request body.
    var client = new ClientSchema({
        name: req.body.name,
        phones: req.body.phones
    });

    // Executes the save command to Mongo.
    client.save(function (err) {
        if (err) {
            var errMsg = "Sorry, there was an error saving the client. " + err;
        }
        else {
            console.log("New client was saved!");
        }
    });
};

// Returns a list of all the clients in the database.
module.exports.list = function (req, res) {
    console.log("exports.list: Getting all clients...");

    // Creates a new query to find all clients and sort them ascendingly.
    var query = ClientSchema.find().sort({ name: "asc" });

    // Executes the find query.
    query.exec(function (err, results) {
        if (err) {
            console.log("Errors");
            var errMsg = "Sorry, there was an error retrieving the clients. " + err;
        }
        else {
            console.log("No errors");
            res.send(results);
            res.end();
        }
    });
};

// Returns a list of all the clients by name in the database.
module.exports.find = function (req, res) {
    console.log("exports.find: Finding by client name");

    // Creates a new query to find all clients and filters them by name (Regex for LIKE) taken from the request parameters.
    var query = ClientSchema.find({ 'name': { "$regex": req.params.name, "$options": "i" } });

    //Adds a sort order to the query.
    query.sort({ create: "asc" });

    // Executes the find query.
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

// Returns a single client by _id property from the database.
module.exports.get = function (req, res) {
    console.log("exports.find: Finding by client id");

    //Creates a new query to find a single client by _id taken from the request parameters.
    var query = ClientSchema.findById(req.params.id);

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
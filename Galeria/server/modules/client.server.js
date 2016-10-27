// References the schema for clients
var ClientSchema = require("../schemas/client.schema.js");

var newClient = function (req, res) {
    console.log("Saving client...");

    // Creates an instance of the client schema with the data from the request body.
    var client = new ClientSchema({
        name: req.body.name,
        phones: req.body.phones,
        created: req.body.created
    });

    console.log(req.body.created);

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

var updateClient = function (req, res) {
    console.log("category.update: Updating client...");

    var query = {
        _id: req.body.id
    };

    var newData = {
        name: req.body.name,
        phones: req.body.phones,
        created: req.body.created
    };

    ClientSchema.update(query, newData, { multi: false }, function (err, numAffected) {
        if (err) {
            console.log("Errors");
            var errMsg = "Sorry, there was an error updating the category. " + err;
        } else {
            console.log("Client was updated");
            console.log(numAffected);
            res.send({ _id: req.body.id });
            res.end();
        }
    });
};

// Creates a new client object in the database.
module.exports.save = function (req, res) {
    if (req.body.id) {
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
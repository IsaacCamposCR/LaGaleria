var ClientSchema = require("../schemas/client.schema.js");

module.exports.save = function (req, res) {
    console.log("Saving client...");

    var client = new ClientSchema({
        name: req.body.name,
        phones: req.body.phones
    });

    client.save(function (err) {
        if (err) {
            var errMsg = "Sorry, there was an error saving the client. " + err;
        }
        else {
            console.log("New client was saved!");
        }
    });
};

module.exports.list = function (req, res) {
    console.log("exports.list: Getting all clients...");
    
    var query = ClientSchema.find();

    query.sort({ name: "desc" })
        .exec(function (err, results) {
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

module.exports.find = function (req, res) {
    console.log("exports.find: Finding by client name");

    var query = ClientSchema.find({'name': {"$regex": req.params.name, "$options": "i"}});

    query.sort({ create: "desc" });

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
}
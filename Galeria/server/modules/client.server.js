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
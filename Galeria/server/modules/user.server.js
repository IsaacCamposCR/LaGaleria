// References the json web token library.
var jwt = require("jsonwebtoken");
// References the schema for categories.
var UserSchema = require("../schemas/user.schema.js");

module.exports.login = function (req, res) {
    // Creates a new query to find a single user from the request parameters.
    var query = UserSchema.find().where({ username: req.body.username });

    query.exec(function (err, results) {
        if (results.length <= 0) {
            res.send({ results: null, errors: "Usuario no existe..." });
            res.end();
        }
        // Compare passwords.
        else {
            // Responds with the json web token for the user.
            if (results[0].password === req.body.password) {
                var myToken = jwt.sign({ username: req.body.username }, "nyancat 4 ever");
                res.send({ results: myToken, errors: err });
                res.end();
            }
            // The password does not match.
            else {
                res.send({ results: null, errors: "El password es incorrecto..." });
                res.end();
            }
        }
    });
};

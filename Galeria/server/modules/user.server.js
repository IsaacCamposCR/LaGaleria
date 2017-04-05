// References the json web token library.
var jwt = require("jsonwebtoken");
// References the schema for categories.
var UserSchema = require("../schemas/user.schema.js");
// References the bcrypt library
var bcrypt = require('bcrypt');

var comparePassword = function (password, hash) {

    // Load hash from your password DB. 
    return bcrypt.compareSync(password, hash);
};

var generatePassword = function (password) {
    var saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
};

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
            if (comparePassword(req.body.password, results[0].password)) {
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

module.exports.save = function (req, res) {
    // Creates an instance of the user schema with the data from the request body.
    var user = new UserSchema({
        username: req.body.username,
        name: req.body.name,
        password: generatePassword(req.body.password)
    });

    // Executes the save command to Mongo.
    user.save(function (err) {
        res.send({ results: req.body, errors: err });
        res.end();
    });
};

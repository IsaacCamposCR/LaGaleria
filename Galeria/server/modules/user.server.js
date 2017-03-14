var jwt = require("jsonwebtoken");

module.exports.login = function (req, res) {
    console.log("login an user");
    var myToken = jwt.sign({ username: req.body.username }, "nyancat 4 ever");
    res.status(200).json(myToken);
};

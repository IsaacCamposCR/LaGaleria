// References the schema for providers
var ReservationSchema = require("../schemas/reservation.schema.js");

module.exports.save = function (req, res) {
    var reservation = new ReservationSchema({
        client: req.body.client,
        invoice: req.body.invoice,
        date: req.body.date,
        price: req.body.price,
        article: req.body.article,
        advances: []
    });

    reservation.save(function (err) {
        res.send({ results: req.body, errors: err });
        res.end();
    });
};
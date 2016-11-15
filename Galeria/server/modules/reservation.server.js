// References the schema for reservation
var ReservationSchema = require("../schemas/reservation.schema.js");

module.exports.save = function (req, res) {

    var reservation = new ReservationSchema({
        client: req.body.client,
        invoice: req.body.invoice,
        date: req.body.date,
        price: req.body.price,
        articles: req.body.articles,
        advances: req.body.advances
    });

    reservation.save(function (err) {
        res.send({ results: req.body, errors: err });
        res.end();
    });
};

module.exports.list = function (req, res) {
    // Creates a new query to find all reservations and sort them ascendingly.
    var query = ReservationSchema.find().sort({ invoice: "asc" });

    // Executes the find query.
    query.exec(function (err, results) {
        results.forEach(function (reservation) {
            reservation.advances.forEach(function (advance) {
                reservation.price -= advance.amount;
            });
        });
        res.send({ results: results, errors: err });
        res.end();
    });
};

module.exports.get = function (req, res) {
    //Creates a new query to find a single reservation by _id taken from the request parameters.
    var query = ReservationSchema.findById(req.params.id);

    // Executes the findById query.
    query.exec(function (err, results) {
        res.send({ results: results, errors: err });
        res.end();
    });
};
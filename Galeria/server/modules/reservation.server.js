// References the schema for reservation
var ReservationSchema = require("../schemas/reservation.schema.js");

var newReservation = function (req, res) {
    // Creates an instance of the reservation schema with the data from the request body.
    var reservation = new ReservationSchema({
        client: req.body.client,
        invoice: req.body.invoice,
        date: req.body.date,
        price: req.body.price,
        articles: req.body.articles,
        advances: req.body.advances
    });

    // Executes the save command to Mongo.
    reservation.save(function (err) {
        res.send({ results: req.body, errors: err });
        res.end();
    });
};

var updateReservation = function (req, res) {
    // Query to select the appropriate provider by id.
    var query = {
        _id: req.body._id
    };

    // New data to be updated.
    var newData = {
        client: req.body.client,
        invoice: req.body.invoice,
        date: req.body.date,
        price: req.body.price,
        articles: req.body.articles,
        advances: req.body.advances
    };

    // Update executed according to query, new data, only one row.
    ReservationSchema.update(query, newData, { multi: false },
        function (err, numAffected) {
            res.send({ results: req.body, errors: err });
            res.end();
        });
};


module.exports.save = function (req, res) {
    // If the id parameter exists in the body, call update, else create a new record.
    if (req.body._id) {
        updateReservation(req, res);
    } else {
        newReservation(req, res);
    }
};

module.exports.list = function (req, res) {
    // Creates a new query to find all reservations and sort them ascendingly.
    var query = ReservationSchema.find().sort({ invoice: "asc" });

    // If the reservations have to be filtered by client id.
    if (req.query._id) {
        query.where('client').equals(req.query._id);
    }

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
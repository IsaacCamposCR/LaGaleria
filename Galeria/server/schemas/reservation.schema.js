var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var reservationSchema = new Schema({
    client: {
        type: String
    },
    invoice: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    articles: [{
        article: { type: String },
        quantity: { type: Number }
    }],
    price: {
        type: Number
    },
    advances: [{
        date: { type: Date, default: Date.now },
        amount: { type: Number }
    }],
    arts: [{
        type: { type: String },
        description: { type: String },
        amount: { type: Date, default: Date.now },
        complete: { type: Boolean }
    }]
});

module.exports = mongoose.model("Reservation", reservationSchema);
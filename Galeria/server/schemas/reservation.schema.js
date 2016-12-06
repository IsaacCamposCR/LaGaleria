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
    delivery: {
        type: Date,
        default: null
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    advances: [{
        date: { type: Date, default: Date.now },
        amount: { type: Number }
    }],
    articles: [{
        article: { type: String },
        quantity: { type: Number }
    }],
    orders: [{
        type: { type: String },
        description: { type: String },
        amount: { type: Number },
        complete: { type: Boolean }
    }]
});

module.exports = mongoose.model("Reservation", reservationSchema);
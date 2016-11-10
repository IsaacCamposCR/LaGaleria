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
    article: {
        type: String
    },
    price: {
        type: Number
    },
    advances: [{
        date: { type: Date, default: Date.now },
        amount: { type: Number }
    }]
});

module.exports = mongoose.model("Reservation", reservationSchema);
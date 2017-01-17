var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var providerSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    phones: {
        type: Array,
        unique: true
    },
    invoices: [{
        // Type can either be Invoice or Receipt.
        // True: invoice, False: receipt.
        type: { type: Boolean },
        number: { type: String },
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        due: { type: Date }
    }]
});

module.exports = mongoose.model("Provider", providerSchema);
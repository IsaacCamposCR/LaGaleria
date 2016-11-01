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
        invoice: { type: String },
        type: { type: String },
        amount: { type: Number }
    }]
});

module.exports = mongoose.model("Provider", providerSchema);
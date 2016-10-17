var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var providerSchema = new Schema({
    name: {
        type: String
    },
    phone: {
        type: String
    },
    invoices: [{
        invoice: { type: String },
        type: { type: String },
        amount: { type: Number }
    }]
});

module.exports = mongoose.model("Provider", providerSchema);
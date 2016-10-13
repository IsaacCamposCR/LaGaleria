var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var entrySchema = new Schema({
    client: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    advance: {
        type: Number
    },
    arts: [{
        type: { type: String },
        description: { type: String },
        amount: { type: Date, default: Date.now },
        complete: { type: Boolean }
    }]
});

// Export model...
module.exports = mongoose.model("Entry", entrySchema);

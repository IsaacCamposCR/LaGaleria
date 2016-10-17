var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var clientSchema = new Schema({
    name: {
        type: String
    },
    phones: {
        type: Array
    }
});

// Export model...
module.exports = mongoose.model("ClientSchema", clientSchema);
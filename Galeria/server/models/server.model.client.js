var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var clientSchema = new Schema({
    name: {
        type: String
    },
    phone: {
        type: String
    }
});

// Export model...
module.exports = mongoose.model("Client", clientSchema);
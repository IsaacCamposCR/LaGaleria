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

// Export model. The name parameter will set the collection name in MongoDB
module.exports = mongoose.model("Client", clientSchema);
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String
    },
    name: {
        type: String
    },
    password: {
        type: String
    }
});

// Export model...
module.exports = mongoose.model("User", userSchema);
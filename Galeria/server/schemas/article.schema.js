var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    category: {
        type: String
    },
    code: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        unique: true
    },
    provider: {
        type: String
    },
    stock: {
        type: Number
    },
    price: {
        type: Number
    }
});

// Export model...
module.exports = mongoose.model("Article", articleSchema);
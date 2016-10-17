var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    category: {
        type: String
    },
    invoice: {
        type: String
    },
    description: {
        type: String
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
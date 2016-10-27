var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    category: { type: String, unique: true }
});

module.exports = mongoose.model("Category", CategorySchema);
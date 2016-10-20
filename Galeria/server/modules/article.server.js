// References the schema for articles
var ArticleSchema = require("../schemas/article.schema.js");

module.exports.save = function (req, res) {
    console.log("Saving article...");

    // Creates an instance of the article schema with the data from the request body.
    var article = new ArticleSchema({
        category: req.body.category,
        invoice: req.body.invoice,
        description: req.body.description,
        provider: req.body.provider,
        stock: req.body.stock,
        price: req.body.price
    });

    // Executes the save command to Mongo.
    article.save(function (err) {
        if (err) {
            var errMsg = "Sorry, there was an error saving the article. " + err;
        }
        else {
            console.log("New article was saved!");
        }
    });
};

module.exports.list = function (req, res) {
    console.log("article.list: Getting all articles...");

    // Creates a new query to find all articles and sort them ascendingly by category and name.
    var query = ArticleSchema.find().sort({ catergory: "asc", description: "asc" });

    // Executes the find query.
    query.exec(function (err, results) {
        if (err) {
            console.log("Errors");
            var errMsg = "Sorry, there was an error retrieving the articles. " + err;
        }
        else {
            console.log("No errors");
            res.send(results);
            res.end();
        }
    });
};
// References the schema for articles
var ArticleSchema = require("../schemas/article.schema.js");

var newArticle = function (req, res) {
    // Creates an instance of the article schema with the data from the request body.
    var article = new ArticleSchema({
        category: req.body.category,
        code: req.body.code,
        description: req.body.description,
        provider: req.body.provider,
        stock: req.body.stock,
        price: req.body.price
    });

    // Executes the save command to Mongo.
    article.save(function (err, results) {
        res.send({ results: results, errors: err });
        res.end();
    });
};

var updateArticle = function (req, res) {
    var query = {
        _id: req.body._id
    };

    var newData = {
        category: req.body.category,
        code: req.body.code,
        description: req.body.description,
        provider: req.body.provider,
        stock: req.body.stock,
        price: req.body.price
    };

    ArticleSchema.update(query, newData, { multi: false },
        function (err, numAffected) {
            res.send({ results: req.body, errors: err });
            res.end();
        });
};

module.exports.save = function (req, res) {
    if (req.body._id) {
        updateArticle(req, res);
    } else {
        newArticle(req, res);
    }
};

module.exports.list = function (req, res) {

    // Creates a new query to find all articles and sort them ascendingly by category and name.
    var query = ArticleSchema.find();

    if (req.query.description) {
        // Creates a new query to find all articles and filters them by description (Regex for LIKE) taken from the request query parameters.
        query = ArticleSchema.find({ 'description': { "$regex": req.query.description, "$options": "i" } });
    }

    query.where({ category: req.query.category });
    query.sort({ category: "asc", description: "asc" });

    // Executes the find query.
    query.exec(function (err, results) {
        res.send({ results: results, errors: err });
        res.end();
    });
};

// Returns a single article by _id property from the database.
module.exports.get = function (req, res) {

    //Creates a new query to find a single article by _id taken from the request parameters.
    var query = ArticleSchema.findById(req.params.id);

    // Executes the findById query.
    query.exec(function (err, results) {
        res.send({ results: results, errors: err });
        res.end();
    });
};
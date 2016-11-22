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
        history: req.body.history,
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
        history: req.body.history,
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

    if (req.query.filter) {
        // These are unfiltered search to return a flat list of articles when autocomplete search is performed.
        // The reason this is the same as the bottom query is because the query.filter property differentiates
        // when a query requires being filterd by categories or not.
        query = ArticleSchema.find({ 'description': { "$regex": req.query.filter, "$options": "i" } });

        if (req.query.stock) {
            query.where('stock').gt(0);
        }
    } else {
        // These search terms apply only to the INVENTORY component.
        if (req.query.description) {
            // Creates a new query to find all articles and filters them by description (Regex for LIKE) taken from the request query parameters.
            query = ArticleSchema.find({ 'description': { "$regex": req.query.description, "$options": "i" } });
        }

        query.where({ category: req.query.category });
    }

    // Articles are sorted regardless of the origin query.
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
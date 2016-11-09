var express = require("express");
var morgan = require("morgan");
var path = require("path");

// Mongoose ODM...
var mongoose = require("mongoose");

//Connect to MongoDB...
mongoose.connect("mongodb://camposi:123qweEE@ds057176.mlab.com:57176/gallerydb", function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Database initialized...");
    }
});

// Gets rid of the promise library deprecated warning from mongoose.
mongoose.Promise = global.Promise;

var app = express();
var rootPath = path.normalize(__dirname + "/../");
var bodyParser = require("body-parser");

//app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(rootPath + "/app"));

// Client Server
var clients = require("./modules/client.server");
var articles = require("./modules/article.server");
var categories = require("./modules/category.server");
var providers = require("./modules/provider.server");

// Client endpoints
// Creates a new client
app.post("/api/client/", clients.save);
// Gets a list of all clients can be filtered by name.
app.get("/api/client/", clients.list);
// Gets a client by _id
app.get("/api/client/:id", clients.get);

// Inventory endpoints
// Creates a new article
app.post("/api/article/", articles.save);
// Gets a list of all articles, can be a search by description
app.get("/api/article/", articles.list);
// Gets an article by _id
app.get("/api/article/:id", articles.get);
// Creates a new category
app.post("/api/category/", categories.save);
// Gets a list of all categories
app.get("/api/category/", categories.list);
// Gets a category
app.get("/api/category/:category", categories.get);

// Provider endpoints 
// Creates a new Provider
app.post("/api/provider/", providers.save);
// Gets a list of all providers, can filtered by name.
app.get("/api/provider/", providers.list);
// Gets a provider by _id.
app.get("/api/provider/:id", providers.get);
// Gets the list of invoices from a provider by _id.
app.get("/api/provider/:id/invoices", providers.invoices);

app.get("*", function (req, res) {
    res.sendFile(rootPath + "/app/index.html");
});

app.listen(8000);
console.log("Listening on port 8000...");
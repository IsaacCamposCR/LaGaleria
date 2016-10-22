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
        console.log("Database initialized...")
    }
});

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

// Client endpoints
// Creates a new client
app.post("/api/client/", clients.save);
// Gets a client by _id
app.get("/api/client/:id", clients.get);
// Gets a list of all clients
app.get("/api/clients/", clients.list);
// Gets a list of all clients by name
app.get("/api/clients/:name", clients.find);

// Inventory endpoints
// Creates a new article
app.post("/api/article/", articles.save);
// Gets a list of all articles
app.get("/api/article/", articles.list);
// Gets an article by _id
app.get("/api/article/:id", articles.get);

app.get("*", function (req, res) {
    res.sendFile(rootPath + "/app/index.html");
});

app.listen(8000);
console.log("Listening on port 8000...");
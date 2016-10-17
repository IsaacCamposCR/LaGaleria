var express = require("express");
var morgan = require("morgan");
var path = require("path");

// Client Server
var clients = require("./modules/client.server");

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

app.use(morgan("dev")); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(rootPath + "/app"));

// Client endpoints
app.post("/data/client/:id", clients.save);

app.get("*", function (req, res) {
    res.sendFile(rootPath + "/app/index.html");
});

app.listen(8000);/*
console.log("rootPath: " + rootPath);
console.log(rootPath + "../app/index.html");
console.log(rootPath + "/app");*/
console.log("Listening on port 8000...");
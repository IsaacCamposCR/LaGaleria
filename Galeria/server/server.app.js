var express = require("express");
var path = require("path");

// Mongoose ODM...
var mongoose = require("mongoose");

//Connect to MongoDB...
mongoose.connect("mongodb://camposi:123qweEE@ds057176.mlab.com:57176/gallerydb", function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Database initialized...")
    }
});

var app = express();
var rootPath = path.normalize(__dirname + "/../");

app.use(express.static(rootPath + "/app"));

app.get("*", function (req, res) {
    res.sendFile(rootPath + "/app/index.html");
});

app.listen(8000);
console.log("Listening on port 8000...");
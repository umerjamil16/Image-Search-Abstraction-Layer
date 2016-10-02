var express = require("express");
var app = express();

var bodyParser = require("body-parser");

var PORT = process.env.PORT;
var unsplash = require('unsplash-api');
var clientId = '7a47702e60c7874bf9114bd79340284e2cd8f493eee0be06f6e9fa7b44356a2c'; //this is required to verify your application's requests 
unsplash.init(clientId);

var finalArray = [];

app.use(bodyParser.json());

app.get("/", function(req, res, next) {
  res.send("Working!!");
});

app.get("/searchImage/:data", function(req, res, next) {
  var offset = parseInt(req.query.offset, 10) || 0;
  var searchString = req.params.data.toString();
    unsplash.searchPhotos(searchString, null, null, null, function(error, photos, link) {
        if (!error) {
            for(var i=0; i<photos.length; i+=1+offset) {
                var obj = {};
                obj.url = photos[i].urls.raw;
                obj.thumbnail = photos[i].urls.thumb;
                obj.Upoaded_By = photos[i].user.name;
                finalArray.push(obj);
            }
            res.json(finalArray);

        } else
            res.json(error);
    });

});


app.listen(PORT, function() {
    console.log("Server running on PORT " + PORT);
});

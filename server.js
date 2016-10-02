var express = require("express");
var app = express();

var PORT = process.env.PORT;
var unsplash = require('unsplash-api');
var clientId = '7a47702e60c7874bf9114bd79340284e2cd8f493eee0be06f6e9fa7b44356a2c'; //this is required to verify your application's requests 
unsplash.init(clientId);

var finalArray = [];

app.get("/", function(req, res, next) {

    unsplash.searchPhotos('bunny', null, null, null, function(error, photos, link) {
        if (!error) {
            photos.forEach(function(entry) {
                var obj = {};
                obj.url = entry.urls.raw;
                obj.thumbnail = entry.urls.thumb;
                obj.Upoaded_By = entry.user.name;
                finalArray.push(obj);
            });
            //Access default 10 photos from first page of search results here 
            res.json(finalArray);

        } else
            res.json(error);
    });

});


app.listen(PORT, function() {
    console.log("Server running on PORT " + PORT);
});
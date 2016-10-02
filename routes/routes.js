module.exports = function(express, app) {
    var router = express.Router();
    var MongoClient = require("mongodb").MongoClient;
    var moment = require('moment');
    moment().format();

    var unsplash = require('unsplash-api');
    var clientId = '7a47702e60c7874bf9114bd79340284e2cd8f493eee0be06f6e9fa7b44356a2c'; //this is required to verify your application's requests 
    unsplash.init(clientId);

    var db;

    var mongoURL = "mongodb://user:password@ds041939.mlab.com:41939/image-search-abstraction-layer";

    MongoClient.connect(mongoURL, (err, database) => {
        if (err) return console.log(err)
        db = database
        app.listen(3000, () => {
            //  console.log('listening on 3000')
        })
    });


    var finalArray = [];
    var historyArray=[];


    app.get("/", function(req, res, next) {
        res.render("index", {});
    });


    router.get("/history", function(req, res, next) {
        db.collection('history').find().toArray((err, result) => {
            if (err) return console.log(err);
            for (var i = 0; i < result.length; i++) {
                var obj = {};
                obj.item = result[i].item;
                obj.when = result[i].when;
                historyArray.push(obj);
            }
            res.json(historyArray);

        });

    });


    router.get("/searchImage/:data", function(req, res, next) {
        var now = moment().toString();

        var offset = parseInt(req.query.offset, 10) || 0;
        var searchString = req.params.data.toString();

        db.collection('history').save({
            item: searchString,
            when: now
        }, (err, result) => {
            if (err) return console.log(err);
        });

        unsplash.searchPhotos(searchString, null, null, null, function(error, photos, link) {
            if (!error) {
                for (var i = 0; i < photos.length; i += 1 + offset) {
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

    app.use("/", router);
}
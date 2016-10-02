var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var path = require("path");
var PORT = process.env.PORT;
require("./routes/routes.js")(express, app);

app.use(bodyParser.json());
app.engine("html", require("hogan-express"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.use(express.static(path.join(__dirname, "public")));



app.listen(PORT, function() {
    console.log("Server running on PORT " + PORT);
});

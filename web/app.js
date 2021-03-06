var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var lessMiddleware = require("less-middleware");

var comp_general = require("./routes/comp_general");
var comp_week = require("./routes/comp_week");
var comp_high = require("./routes/comp_high");
var comp_heroes = require("./routes/comp_heroes");
var comp_graphs = require("./routes/comp_graphs");
var quick_general = require("./routes/quick_general");
var quick_heroes = require("./routes/quick_heroes");
var quick_misc = require("./routes/quick_misc");
var quick_week = require("./routes/quick_week");
var quick_high = require("./routes/quick_high");
var owstats_database = require("./routes/owstats_database");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", comp_general);
app.use("/competitive-general", comp_general);
app.use("/competitive-week", comp_week);
app.use("/competitive-high", comp_high);
app.use("/competitive-heroes", comp_heroes);
app.use("/competitive-graphs", comp_graphs);
app.use("/quickplay-general", quick_general);
app.use("/quickplay-heroes", quick_heroes);
app.use("/quickplay-misc", quick_misc);
app.use("/quickplay-week", quick_week);
app.use("/quickplay-high", quick_high);
app.use("/owstats-database", owstats_database);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    var params = {};

    switch (err.status) {
        case 400:
            params.textColor = "text-primary";
            params.textAnimation = "bounceInDown";
            params.errorCode = 400;
            params.errorText = "We are sorry but your request contains bad syntax and cannot be fulfilled..";
            break;
        case 401:
            params.textColor = "text-amethyst";
            params.textAnimation = "fadeInDown";
            params.errorCode = 401;
            params.errorText = "We are sorry but you are not authorized to access this page..";
            break;
        case 403:
            params.textColor = "text-flat";
            params.textAnimation = "bounceIn";
            params.errorCode = 403;
            params.errorText = "We are sorry but you do not have permission to access this page..";
            break;
        case 404:
            params.textColor = "text-city";
            params.textAnimation = "flipInX";
            params.errorCode = 404;
            params.errorText = "We are sorry but the page you are looking for was not found..";
            break;
        case 503:
            params.textColor = "text-smooth";
            params.textAnimation = "rollIn";
            params.errorCode = 503;
            params.errorText = "We are sorry but our service is currently not available..";
            break;
        default:
            params.textColor = "text-modern";
            params.textAnimation = "zoomInDown";
            params.errorCode = 500;
            params.errorText = "We are sorry but our server encountered an internal error..";
            break;
    }

    res.render("pages/error", params);
});

module.exports = app;

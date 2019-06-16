var express = require("express");
var router = express.Router();
var now = require("performance-now");

router.get("/", function(req, res, next) {
    res.render("pages/quick_misc", {
        breadcrumb: {
            title: "Misc",
            description: "Statistics for Gamers which love statistics",
            area: "Quickplay"
        },
        footer: {
            now: now,
            startTime: now()
        },
        url: req.originalUrl
    });
});

module.exports = router;

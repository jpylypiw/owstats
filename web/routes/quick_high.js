var express = require("express");
var router = express.Router();
var now = require("performance-now");

router.get("/", function(req, res, next) {
    res.render("pages/quick_high", {
        breadcrumb: {
            title: "High",
            description: "This page is about some highlights of quickplay gaming. These are the Highest values of some Player stats.",
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

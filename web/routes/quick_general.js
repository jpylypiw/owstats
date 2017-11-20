var express = require("express");
var router = express.Router();
var now = require("performance-now");

router.get("/", function(req, res, next) {
    res.render("pages/quick_general", {
        breadcrumb: {
            title: "General",
            description: "Some statistics of the current ranked season for Quickplay Mode.",
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

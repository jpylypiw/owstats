var express = require("express");
var router = express.Router();
var now = require("performance-now");

router.get("/", function(req, res, next) {
    res.render("pages/quick_heroes", {
        breadcrumb: {
            title: "Heroes",
            description: "Hero stats of quickplay mode of the current ranked season.",
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

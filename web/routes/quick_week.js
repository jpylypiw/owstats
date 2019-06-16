var express = require("express");
var router = express.Router();
var now = require("performance-now");

router.get("/", function(req, res, next) {
    res.render("pages/quick_week", {
        breadcrumb: {
            title: "Weekly",
            description: "The changes of a week. Shown for players with 5+ games last 7 days.",
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

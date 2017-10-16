var express = require("express");
var router = express.Router();
var now = require("performance-now");

router.get("/", function(req, res, next) {
    res.render("pages/comp_average", {
        breadcrumb: {
            title: "Average",
            description: "There are the new 'done in 10 Minutes' stats.",
            area: "Competitive"
        },
        footer: {
            now: now,
            startTime: now()
        },
        url: req.originalUrl
    });
});

module.exports = router;

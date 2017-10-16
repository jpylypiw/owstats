var express = require("express");
var router = express.Router();
var now = require("performance-now");

router.get("/", function(req, res, next) {
    res.render("pages/comp_general", {
        breadcrumb: {
            title: "General",
            description: "The general overall stats of the current season.",
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

var express = require("express");
var router = express.Router();
var now = require("performance-now");

router.get("/", function(req, res, next) {
    res.render("pages/comp_heroes", {
        breadcrumb: {
            title: "Heroes",
            description: "Hero specific statistics for competitive games.",
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

var express = require("express");
var router = express.Router();
var now = require("performance-now");

router.get("/", function(req, res, next) {
    res.render("pages/comp_high", {
        breadcrumb: {
            title: "High",
            description: "The 'most in game' stats. For example you see the highest damage you have done in a competitive game.",
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

var express = require("express");
var router = express.Router();
var now = require("performance-now");

router.get("/", function(req, res, next) {
    res.render("pages/comp_general", {
        breadcrumb: {
            title: "General",
            description: "There are general statistics about Competitive Overwatch Games.",
            area: "Competitive",
        },
        footer: {
            now: now,
            startTime: now(),
        },
        url: req.originalUrl
    });
});

module.exports = router;

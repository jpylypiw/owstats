var express = require("express");
var router = express.Router();
var now = require("performance-now");

router.get("/", function(req, res, next) {
    res.render("pages/owstats_database", {
        breadcrumb: {
            title: "Database",
            description: "This is a page showing the big data!",
            area: "Owstats"
        },
        footer: {
            now: now,
            startTime: now()
        },
        url: req.originalUrl
    });
});

module.exports = router;

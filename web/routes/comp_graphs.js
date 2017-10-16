var express = require("express");
var router = express.Router();
var now = require("performance-now");

router.get("/", function(req, res, next) {
    res.render("pages/comp_graphs", {
        breadcrumb: {
            title: "Graphs",
            description: "Some graphs about competitive season. The timeline shows the last week. Also the changes are calculated for the last week.",
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

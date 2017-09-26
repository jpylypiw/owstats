var express = require("express");
var router = express.Router();
var now = require("performance-now");

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("pages/comp_general", {
        title: "General",
        description: "There are general statistics about Competitive Overwatch Games.",
        breadcrumbTitle: "Competitive",
        breadcrumbPage: "General",
        now: now,
        startTime: now()
    });
});

module.exports = router;

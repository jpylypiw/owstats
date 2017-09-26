var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index", {
        title: "General",
        description: "There are general statistics about Competitive Overwatch Games.",
        breadcrumbTitle: "Competitive",
        breadcrumbPage: "General"
    });
});

module.exports = router;

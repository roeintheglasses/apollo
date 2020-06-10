const router = require('express').Router();

router.get("/", (req, res) => {
    res.render("index");
});
router.get("/music", (req, res) => {
    res.render("music");
});
router.get("/videos", (req, res) => {
    res.render("video");
});
module.exports = router;
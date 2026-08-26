const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

    res.json({
        success: true,
        service: "Rating Service",
        message: "Service is running successfully"
    });

});

module.exports = router;
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        service: "Order Service",
        message: "Service is running successfully"
    });

});

module.exports = router;
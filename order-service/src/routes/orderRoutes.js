const express = require("express");

const router = express.Router();

const orderController = require("../controllers/orderController");


// Basket APIs
router.post("/basket", orderController.addToBasket);

router.get("/basket", orderController.getBasket);

router.put("/basket/:id", orderController.updateBasket);

router.delete("/basket/:id", orderController.deleteBasket);


// Order APIs
router.post("/checkout", orderController.checkout);

router.get("/", orderController.getOrders);


module.exports = router;
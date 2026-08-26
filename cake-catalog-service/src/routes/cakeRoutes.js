const express = require("express");

const router = express.Router();

const cakeController = require("../controllers/cakeController");

// Add Cake
router.post("/", cakeController.addCake);

// Browse All Cakes / Filter Cakes
router.get("/", cakeController.getAllCakes);

// Cake Details
router.get("/:id", cakeController.getCakeById);

// Delete Cake
router.delete("/:id", cakeController.deleteCake);

module.exports = router;

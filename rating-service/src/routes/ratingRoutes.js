const express = require("express");

const router = express.Router();

const ratingController = require("../controllers/ratingController");

// Add Rating
router.post("/", ratingController.addRating);

// Get Ratings By Cake
router.get("/:cakeId", ratingController.getRatingsByCake);

// Get Average Rating
router.get("/:cakeId/average", ratingController.getAverageRating);

// Delete Rating
router.delete("/:id", ratingController.deleteRating);

module.exports = router;

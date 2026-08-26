const ratingService = require("../services/ratingService");

// Add Rating

async function addRating(req, res) {
  try {
    const rating = await ratingService.addRating(req.body);

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      data: rating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get Ratings By Cake

async function getRatingsByCake(req, res) {
  try {
    const ratings = await ratingService.getRatingsByCake(req.params.cakeId);

    res.json({
      success: true,
      data: ratings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get Average Rating

async function getAverageRating(req, res) {
  try {
    const average = await ratingService.getAverageRating(req.params.cakeId);

    res.json({
      success: true,
      data: average,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete Rating

async function deleteRating(req, res) {
  try {
    await ratingService.deleteRating(req.params.id);

    res.json({
      success: true,
      message: "Rating deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  addRating,
  getRatingsByCake,
  getAverageRating,
  deleteRating,
};

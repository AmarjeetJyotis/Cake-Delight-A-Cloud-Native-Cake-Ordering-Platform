const Rating = require("../models/Rating");
const { Sequelize } = require("sequelize");

// Add Rating

async function addRating(data) {
  if (!data.cakeId) {
    throw new Error("Cake ID is required");
  }

  if (!data.userName || data.userName.trim() === "") {
    throw new Error("User name is required");
  }

  const ratingValue = Number(data.rating);

  if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const rating = await Rating.create({
    cakeId: Number(data.cakeId),
    userName: data.userName.trim(),
    rating: ratingValue,
    review: data.review || "",
  });

  return rating;
}

// Get Ratings By Cake

async function getRatingsByCake(cakeId) {
  return await Rating.findAll({
    where: {
      cakeId: cakeId,
    },
    order: [["id", "DESC"]],
  });
}

// Get Average Rating

async function getAverageRating(cakeId) {
  const result = await Rating.findOne({
    attributes: [
      [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
    ],

    where: {
      cakeId: cakeId,
    },

    raw: true,
  });

  return {
    cakeId: Number(cakeId),

    averageRating: result.averageRating
      ? Number(Number(result.averageRating).toFixed(1))
      : 0,
  };
}

// Delete Rating

async function deleteRating(id) {
  const rating = await Rating.findByPk(id);

  if (!rating) {
    throw new Error("Rating not found");
  }

  await rating.destroy();
}

module.exports = {
  addRating,
  getRatingsByCake,
  getAverageRating,
  deleteRating,
};

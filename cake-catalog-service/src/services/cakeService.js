const Cake = require("../models/Cake");
const { Op } = require("sequelize");

// Add a new cake
async function addCake(cakeData) {
  return await Cake.create(cakeData);
}

// Get all cakes
async function getAllCakes() {
  return await Cake.findAll();
}

// Get cake by ID
async function getCakeById(id) {
  return await Cake.findByPk(id);
}

// Filter cakes
async function filterCakes(filters) {
  const where = {};

  // Filter by name
  if (filters.name) {
    where.name = {
      [Op.like]: `%${filters.name}%`,
    };
  }

  // Filter by category
  if (filters.category) {
    where.category = filters.category;
  }

  // Filter by minimum price
  if (filters.minPrice) {
    where.price = {
      [Op.gte]: Number(filters.minPrice),
    };
  }

  // Filter by maximum price
  if (filters.maxPrice) {
    where.price = {
      ...(where.price || {}),
      [Op.lte]: Number(filters.maxPrice),
    };
  }

  return await Cake.findAll({
    where,
  });
}

// Delete cake
async function deleteCake(id) {
  const cake = await Cake.findByPk(id);

  if (!cake) {
    return false;
  }

  await cake.destroy();

  return true;
}

module.exports = {
  addCake,
  getAllCakes,
  getCakeById,
  filterCakes,
  deleteCake,
};

const cakeService = require("../services/cakeService");

// Add Cake
async function addCake(req, res) {
  try {
    const cake = await cakeService.addCake(req.body);

    res.status(201).json({
      success: true,
      message: "Cake added successfully",
      data: cake,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get All Cakes / Filter Cakes
async function getAllCakes(req, res) {
  try {
    const hasFilters =
      req.query.name ||
      req.query.category ||
      req.query.minPrice ||
      req.query.maxPrice;

    let cakes;

    if (hasFilters) {
      cakes = await cakeService.filterCakes(req.query);
    } else {
      cakes = await cakeService.getAllCakes();
    }

    res.status(200).json({
      success: true,
      data: cakes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get Cake By Id
async function getCakeById(req, res) {
  try {
    const cake = await cakeService.getCakeById(req.params.id);

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: "Cake not found",
      });
    }

    res.status(200).json({
      success: true,
      data: cake,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete Cake
async function deleteCake(req, res) {
  try {
    const deleted = await cakeService.deleteCake(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Cake not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cake deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  addCake,
  getAllCakes,
  getCakeById,
  deleteCake,
};

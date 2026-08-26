const orderService = require("../services/orderService");

// Add To Basket

async function addToBasket(req, res) {
  try {
    const basket = await orderService.addToBasket(req.body);

    res.status(201).json({
      success: true,
      message: "Cake added to basket successfully",
      data: basket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get Basket

async function getBasket(req, res) {
  try {
    const basket = await orderService.getBasket();

    res.json({
      success: true,
      data: basket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Update Basket

async function updateBasket(req, res) {
  try {
    const basket = await orderService.updateBasket(
      req.params.id,
      req.body.quantity,
    );

    res.json({
      success: true,
      message: "Basket updated successfully",
      data: basket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete Basket

async function deleteBasket(req, res) {
  try {
    await orderService.deleteBasket(req.params.id);

    res.json({
      success: true,
      message: "Item removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Checkout

async function checkout(req, res) {
  try {
    const { customerName, customerEmail, deliveryAddress } = req.body;

    if (!customerName) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    const order = await orderService.checkout(
      customerName,
      customerEmail,
      deliveryAddress,
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get Orders

async function getOrders(req, res) {
  try {
    const orders = await orderService.getOrders();

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  addToBasket,
  getBasket,
  updateBasket,
  deleteBasket,
  checkout,
  getOrders,
};

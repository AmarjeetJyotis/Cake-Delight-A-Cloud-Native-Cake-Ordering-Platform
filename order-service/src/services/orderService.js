const BasketItem = require("../models/BasketItem");
const Order = require("../models/Order");

const { publishOrderCompleted } = require("../messaging/rabbitmq");

// Add To Basket

async function addToBasket(data) {
  const totalPrice = data.price * data.quantity;

  const basketItem = await BasketItem.create({
    cakeId: data.cakeId,
    cakeName: data.cakeName,
    price: data.price,
    quantity: data.quantity,
    totalPrice,
  });

  return basketItem;
}

// Get Basket

async function getBasket() {
  return await BasketItem.findAll();
}

// Update Basket

async function updateBasket(id, quantity) {
  const basketItem = await BasketItem.findByPk(id);

  if (!basketItem) {
    throw new Error("Basket item not found");
  }

  basketItem.quantity = quantity;
  basketItem.totalPrice = basketItem.price * quantity;

  await basketItem.save();

  return basketItem;
}

// Delete Basket

async function deleteBasket(id) {
  const basketItem = await BasketItem.findByPk(id);

  if (!basketItem) {
    throw new Error("Basket item not found");
  }

  await basketItem.destroy();
}

// Checkout

async function checkout(customerName, customerEmail, deliveryAddress) {
  const basket = await BasketItem.findAll();

  if (basket.length === 0) {
    throw new Error("Basket is empty");
  }

  let totalAmount = 0;

  basket.forEach((item) => {
    totalAmount += Number(item.totalPrice);
  });

  // Create Order
  const order = await Order.create({
    totalAmount,
    status: "PLACED",
  });

  // Prepare order items for notification
  const items = basket.map((item) => ({
    cakeId: item.cakeId,
    cakeName: item.cakeName,
    price: Number(item.price),
    quantity: item.quantity,
    totalPrice: Number(item.totalPrice),
  }));

  // Empty Basket
  await BasketItem.destroy({
    where: {},
  });

  // Publish Order Completed Event

  try {
    await publishOrderCompleted({
      orderId: order.id,
      customerName: customerName || "Customer",
      customerEmail: customerEmail || "",
      deliveryAddress: deliveryAddress || "",
      totalAmount,
      items,
    });
  } catch (error) {
    console.log("⚠️ RabbitMQ unavailable:", error.message);
  }

  return order;
}

// Get Orders

async function getOrders() {
  return await Order.findAll();
}

module.exports = {
  addToBasket,
  getBasket,
  updateBasket,
  deleteBasket,
  checkout,
  getOrders,
};

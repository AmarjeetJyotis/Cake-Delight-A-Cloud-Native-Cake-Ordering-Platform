const Notification = require("../models/Notification");

// Save Notification

async function sendNotification(data) {
  const notification = await Notification.create({
    orderId: data.orderId,
    customerName: data.customerName,
    message: data.message,
    status: "SENT",
  });

  return notification;
}

// Get Notification History

async function getNotifications() {
  return await Notification.findAll({
    order: [["id", "DESC"]],
  });
}

// Delete Notification

async function deleteNotification(id) {
  const notification = await Notification.findByPk(id);

  if (!notification) {
    throw new Error("Notification not found");
  }

  await notification.destroy();

  return notification;
}

module.exports = {
  sendNotification,
  getNotifications,
  deleteNotification,
};

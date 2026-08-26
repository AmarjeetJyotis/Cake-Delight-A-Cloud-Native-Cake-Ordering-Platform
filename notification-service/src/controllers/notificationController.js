const notificationService = require("../services/notificationService");

// Save Notification

async function sendNotification(req, res) {
  try {
    const notification = await notificationService.sendNotification(req.body);

    res.status(201).json({
      success: true,

      message: "Notification sent successfully",

      data: notification,
    });
  } catch (error) {
    console.error("Send Notification Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

// Get Notification History

async function getNotifications(req, res) {
  try {
    const notifications = await notificationService.getNotifications();

    res.json({
      success: true,

      data: notifications,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

// Delete Notification

async function deleteNotification(req, res) {
  try {
    const notification = await notificationService.deleteNotification(
      req.params.id,
    );

    res.json({
      success: true,

      message: "Notification deleted successfully",

      data: notification,
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);

    if (error.message === "Notification not found") {
      return res.status(404).json({
        success: false,

        message: error.message,
      });
    }

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

module.exports = {
  sendNotification,
  getNotifications,
  deleteNotification,
};

const express = require("express");

const router = express.Router();

const notificationController = require("../controllers/notificationController");

// Create Notification
router.post("/", notificationController.sendNotification);

// Get Notifications
router.get("/", notificationController.getNotifications);

// Delete Notification
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;

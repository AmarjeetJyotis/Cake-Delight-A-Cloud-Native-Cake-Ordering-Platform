require("dotenv").config();

module.exports = {
    catalogService: process.env.CATALOG_SERVICE,
    orderService: process.env.ORDER_SERVICE,
    ratingService: process.env.RATING_SERVICE,
    notificationService: process.env.NOTIFICATION_SERVICE
};
const app = require("./app");
const { connectDatabase, sequelize } = require("./config/database");
const { startNotificationConsumer } = require("./messaging/rabbitmq");

const PORT = process.env.PORT || 5004;

async function startServer() {
  try {
    await connectDatabase();

    await sequelize.sync();

    console.log("Database Tables Synced Successfully");

    app.listen(PORT, () => {
      console.log(`Notification Service Running On Port ${PORT}`);
    });

    await startNotificationConsumer();
  } catch (error) {
    console.error("Server Startup Failed");
    console.error(error);
  }
}

startServer();

const app = require("./app");
const sequelize = require("./config/database");

// Import Cake model
require("./models/Cake");

const seedCakes = require("./seedCakes");

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // Check database connection
    await sequelize.authenticate();
    console.log("✅ Database Connected Successfully");

    // Create table if it doesn't exist
    await sequelize.sync();
    console.log("✅ Database Tables Synced Successfully");

    // Add initial sample data only when database is empty
    await seedCakes();

    app.listen(PORT, () => {
      console.log(` Cake Catalog Service Running On Port ${PORT}`);
    });
  } catch (error) {
    console.error(" Failed To Start Server");
    console.error(error.message);
  }
}

startServer();

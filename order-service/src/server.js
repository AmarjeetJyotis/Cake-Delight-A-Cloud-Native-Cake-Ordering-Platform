require("dotenv").config();

const app = require("./app");
const { connectDatabase, sequelize } = require("./config/database");

const PORT = process.env.PORT || 5002;

async function startServer() {
    try {
        // Connect MySQL Database
        await connectDatabase();

        // Create tables automatically if they do not exist
        await sequelize.sync();

        console.log("Database Tables Synced Successfully");

        // Start Express Server
        app.listen(PORT, () => {
            console.log(`Order Service Running On Port ${PORT}`);
        });

    } catch (error) {
        console.error("Server Startup Failed");
        console.error(error);
    }
}

startServer();
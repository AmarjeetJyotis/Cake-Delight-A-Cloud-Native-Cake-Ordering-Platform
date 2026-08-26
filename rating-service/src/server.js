const app = require("./app");
const { connectDatabase, sequelize } = require("./config/database");

const PORT = process.env.PORT || 5003;

async function startServer() {

    await connectDatabase();

    await sequelize.sync();

    console.log("✅ Database Tables Synced Successfully");

    app.listen(PORT, () => {
        console.log(`🚀 Rating Service Running On Port ${PORT}`);
    });

}

startServer();
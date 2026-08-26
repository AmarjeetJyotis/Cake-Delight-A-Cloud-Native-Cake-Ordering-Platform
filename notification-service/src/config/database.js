const { Sequelize } = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false
    }
);

async function connectDatabase() {

    try {

        await sequelize.authenticate();

        console.log("Database Connected Successfully");

    } catch (error) {

        console.log(" Database Connection Failed");
        console.log(error.message);

    }

}

module.exports = {
    sequelize,
    connectDatabase
};
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Notification = sequelize.define(
    "Notification",
    {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        customerName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        status: {
            type: DataTypes.STRING,
            defaultValue: "SENT"
        },

        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }

    },

    {
        tableName: "notifications",
        timestamps: false
    }

);

module.exports = Notification;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cake = sequelize.define(
    "Cake",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        category: {
            type: DataTypes.STRING,
            allowNull: false
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        availability: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        imageReference: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: "cakes",
        timestamps: false
    }
);

module.exports = Cake;
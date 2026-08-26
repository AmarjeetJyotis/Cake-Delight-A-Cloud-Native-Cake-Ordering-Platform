const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const BasketItem = sequelize.define(
    "BasketItem",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        cakeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        cakeName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        totalPrice: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        }
    },
    {
        tableName: "basket_items",
        timestamps: false
    }
);

module.exports = BasketItem;
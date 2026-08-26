const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Rating = sequelize.define(
    "Rating",
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

        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        review: {
            type: DataTypes.TEXT
        },

        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "ratings",
        timestamps: false
    }
);

module.exports = Rating;
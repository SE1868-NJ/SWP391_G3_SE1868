"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ShopFollower extends Model {
    static associate(models) {
      // Một ShopFollower thuộc về một User
      ShopFollower.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
        onDelete: "CASCADE",
      });

      // Một ShopFollower thuộc về một Shop
      ShopFollower.belongsTo(models.Shop, {
        foreignKey: "shop_id",
        as: "shop",
        onDelete: "CASCADE",
      });
    }
  }

  ShopFollower.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ShopFollower",
      tableName: "shop_followers",
      timestamps: false,
    }
  );

  return ShopFollower;
};

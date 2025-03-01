"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      this.belongsTo(models.Supplier, {
        foreignKey: "supplier_id",
        as: "supplier",
      });
      this.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });
      this.belongsTo(models.Shop, { foreignKey: "shop_id", as: "shop" });
      this.hasMany(models.Feedback, {
        foreignKey: "product_id",
        as: "feedbacks",
      });
      this.hasMany(models.Cart, { foreignKey: "product_id", as: "carts" });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_description: {
        type: DataTypes.TEXT,
      },
      SKU: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
      },
      import_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      sale_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
      },
      search_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      timestamps: true,
    }
  );
  return Product;
};

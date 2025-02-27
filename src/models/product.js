'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Category, {
                foreignKey: 'category_id',
                as: 'category',
                onDelete: 'RESTRICT'
            });
            Product.belongsTo(models.Shop, {
                foreignKey: 'shop_id',
                as: 'shop',
                onDelete: 'CASCADE'
            });
            Product.hasMany(models.Cart, {
                foreignKey: 'product_id',
                as: 'carts'
            });
            Product.hasMany(models.OrderItem, {
                foreignKey: 'product_id',
                as: 'orderItems',
                onDelete: 'CASCADE',
            });
        }
    }

    Product.init({
        product_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        // supplier_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
            allowNull: false,
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
            defaultValue: 0,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
        },
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return Product;
};
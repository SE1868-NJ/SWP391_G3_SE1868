'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user',
                onDelete: 'CASCADE'
            });
            Order.hasMany(models.OrderItem, {
                foreignKey: 'order_id',
                as: 'items',
                onDelete: 'CASCADE'
            });
        }
    }

    Order.init(
        {
            order_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                validate: {
                    notEmpty: true,
                    isInt: true,
                },
            },
            total_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.0,
                validate: {
                    notEmpty: true,
                    isDecimal: true,
                    min: 0,
                },
            },
            status: {
                type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
                allowNull: false,
                defaultValue: 'pending',
                validate: {
                    notEmpty: true,
                    isIn: [['pending', 'completed', 'cancelled']],
                },
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Order',
            tableName: 'orders',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        }
    );

    return Order;
};
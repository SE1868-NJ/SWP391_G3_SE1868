'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'user_id' });
            //Order.belongsTo(models.Address, { foreignKey: 'address_id' });
            //Order.belongsTo(models.Voucher, { foreignKey: 'voucher_id' });
            Order.hasMany(models.OrderDetail, { foreignKey: 'order_id', onDelete: 'CASCADE' });
        }
    }
    Order.ORDER_PAID = 1;
    Order.ORDER_UNPAID = 0;
    Order.ORDER_PENDING = 'PENDING',
    Order.ORDER_COMPLETED = 'COMPLETED',
    Order.ORDER_CANCELLED = 'CANCELLED',
    Order.ORDER_SHIPPING = 'SHIPPING',
    Order.ORDER_DELIVERED = 'DELIVERED',

    Order.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            // primaryKey: true,
            // autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        voucher_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        payment_method: {
            type: DataTypes.STRING,
            allowNull: false
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        shop_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        payment_status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 0
        },  
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: false,
    });
    return Order;
};
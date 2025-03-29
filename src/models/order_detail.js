'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderDetail extends Model {
        static associate(models) {
            OrderDetail.belongsTo(models.Order, { foreignKey: 'order_id', onDelete: 'CASCADE' });
            OrderDetail.belongsTo(models.Product, { foreignKey: 'product_id' });
        }
    }
    OrderDetail.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
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
        }
    }, {
        sequelize,
        modelName: 'OrderDetail',
        tableName: 'order_details',
        timestamps: false,
    });
    return OrderDetail;
}
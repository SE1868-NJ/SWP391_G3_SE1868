'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CartVoucher extends Model {
        static associate(models) {
            CartVoucher.belongsTo(models.Cart, {
                foreignKey: 'cart_id',
                as: 'cart'
            });
            CartVoucher.belongsTo(models.Voucher, {
                foreignKey: 'voucher_id',
                as: 'voucher'
            });
        }
    }

    CartVoucher.init({
        cart_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        voucher_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'CartVoucher',
        tableName: 'cart_voucher',
        timestamps: false,
    });

    return CartVoucher;
};
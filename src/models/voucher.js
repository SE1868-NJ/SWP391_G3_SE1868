'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Voucher extends Model {
        static associate(models) {
            Voucher.belongsTo(models.Shop, {
                foreignKey: 'shop_id',
                as: 'shop',
                onDelete: 'CASCADE'
            });

            Voucher.belongsToMany(models.Cart, {
                through: models.CartVoucher,
                foreignKey: 'voucher_id',
                otherKey: 'cart_id',
                as: 'carts'
            });
        }
    }

    Voucher.init(
        {
            voucher_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            shop_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'shops',
                    key: 'id',
                },
                validate: {
                    notEmpty: true,
                    isInt: true,
                },
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                    len: [1, 50],
                },
            },
            discount_rate: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.0,
                validate: {
                    notEmpty: true,
                    isDecimal: true,
                    min: 0,
                    max: 1, // Tỷ lệ giảm giá tối đa 100%
                },
            },
            max_discount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
                validate: {
                    isDecimal: true,
                    min: 0,
                },
            },
            expiration_date: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    isDate: true,
                    isAfter: new Date().toISOString().split('T')[0], // Ngày hết hạn phải sau ngày hiện tại
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
            modelName: 'Voucher',
            tableName: 'vouchers',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        }
    );

    return Voucher;
};
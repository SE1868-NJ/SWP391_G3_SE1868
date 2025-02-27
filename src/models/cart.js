'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user',
                onDelete: 'CASCADE'
            });

            Cart.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'product',
                onDelete: 'CASCADE'
            });

            Cart.belongsToMany(models.Voucher, {
                through: models.CartVoucher,
                foreignKey: 'cart_id',
                otherKey: 'voucher_id',
                as: 'vouchers'
            });
        }
    }

    Cart.init(
        {
            cart_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id',
                },
                validate: {
                    notEmpty: true,
                    isInt: true,
                },
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'product_id',
                },
                validate: {
                    notEmpty: true,
                    isInt: true,
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    notEmpty: true,
                    isInt: true,
                    min: 1, // Số lượng tối thiểu là 1
                    maxStock(value) {
                        const product = this.getDataValue('product'); // Lấy product từ association
                        if (product && value > product.stock_quantity) {
                            throw new Error(`Số lượng vượt quá kho (${product.stock_quantity} sản phẩm).`);
                        }
                    },
                },
            },
            is_ordered: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                validate: {
                    isBoolean: true,
                },
            },
        },
        {
            sequelize,
            modelName: 'Cart',
            tableName: 'carts',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            hooks: {
                beforeValidate: async (cart, options) => {
                    if (cart.product_id) {
                        const product = await sequelize.models.Product.findByPk(cart.product_id);
                        if (!product) {
                            throw new Error('Sản phẩm không tồn tại.');
                        }
                        cart.dataValues.product = product; // Gán product để validate maxStock
                    }
                },
            },
        }
    );

    return Cart;
};
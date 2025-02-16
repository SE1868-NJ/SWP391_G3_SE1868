const { where } = require('sequelize');
const db = require('../models');

class CartRepository {
    constructor() {
    }

    async getCartsByUserId(userId) {
        return db.Cart.findAll({
            where: {
                user_id: userId,
                is_ordered: false
            },
            include: {
                model: db.Product,
                as: 'product',
                include: {
                    model: db.Category,
                    as: 'category'
                }
            }
        });
    }

    async createCart(cart) {
        return db.Cart.create(cart);
    }

    async getCartById(productId) {
        return db.Cart.findByPk(productId,{
            where: {
                product_id: productId,
                is_ordered: false
            }
        });
    }

    async updateCart(cart) {
        return db.Cart.update(cart, {
            where: {
                id: cart.id
            }
        });
    }
}

module.exports = new CartRepository();
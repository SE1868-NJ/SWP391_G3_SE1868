const db = require('../models');

class CartRepository {
    constructor() { }

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

    async getCartByUserAndProduct(userId, productId) {
        return db.Cart.findOne({
            where: {
                user_id: userId,
                product_id: productId,
                is_ordered: false
            }
        });
    }

    async createCart(cart) {
        return db.Cart.create(cart);
    }

    async getCartByUserAndProduct(userId, productId) {
        return db.Cart.findOne({
            where: {
                user_id: userId,
                product_id: productId,
                is_ordered: false
            }
        });
    }

    async updateCart(cart) {
        return db.Cart.update(
            { quantity: cart.quantity },
            {
                where: { id: cart.id },
            }
        );
    }

    async getCountCartByUserId(userId) {
        return db.Cart.count({
            where: {
                user_id: userId,
                is_ordered: false
            }
        });
    }

    async removeCartItem(cartId) {
        return db.Cart.destroy({
            where: { id: cartId },
        });
    }

    async removeMultipleCartItems(cartIds) {
        return db.Cart.destroy({
            where: { id: cartIds },
        });
    }
}

module.exports = new CartRepository();
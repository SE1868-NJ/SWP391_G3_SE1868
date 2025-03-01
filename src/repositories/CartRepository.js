const db = require('../models');

class CartRepository {
    constructor() { }

    async getCartsByUserId(userId) {
        return db.Cart.findAll({
            where: {
                user_id: userId,
                is_ordered: false,
            },
            include: {
                model: db.Product,
                as: 'product',
                include: [{ model: db.Shop, as: 'shop' }, { model: db.Category, as: 'category', }],
            },
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
                is_ordered: false,
            },
        });
    }

    async updateCart(cart) {
        return db.Cart.update(
            { quantity: cart.quantity },
            {
                where: { cart_id: cart.cart_id },
            }
        );
    }

    async getCountCartByUserId(userId) {
        return db.Cart.count({
            where: {
                user_id: userId,
                is_ordered: false,
            },
        });
    }

    async removeCartItem(cartId) {
        return db.Cart.destroy({
            where: { cart_id: cartId },
        });
    }

    async removeMultipleCartItems(cartIds) {
        return db.Cart.destroy({
            where: { cart_id: cartIds },
        });
    }

    async getCartItemWithVouchers(cartId) {
        const cart = await db.Cart.findByPk(cartId, {
            include: [
                {
                    model: db.Voucher,
                    as: 'vouchers',
                    attributes: ['voucher_id', 'code', 'discount_rate', 'expiration_date'], // Đảm bảo lấy thuộc tính 'code'
                    through: { attributes: [] } // Không lấy dữ liệu từ bảng trung gian CartVoucher
                }
            ]
        });
        console.log('CartItem with vouchers:', JSON.stringify(cart, null, 2)); // Log chi tiết để debug
        return cart || { vouchers: [] }; // Trả về giỏ hàng hoặc mảng rỗng nếu không tìm thấy
    }
}

module.exports = new CartRepository();
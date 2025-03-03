const cartRepository = require('../repositories/CartRepository');
const shopRepository = require('../repositories/ShopRepository');
const db = require('../models');

class CartService {
    constructor() { }

    async getCartsByUserId(userId) {
        try {
            const result = await cartRepository.getCartsByUserId(userId);

            const shopGroupedCarts = result.reduce((acc, cartItem) => {
                const shopId = cartItem.product.shop_id;

                if (!acc[shopId]) {
                    acc[shopId] = {
                        shop_info: null,
                        items: []
                    };
                }

                acc[shopId].items.push({
                    cart_id: cartItem.id,
                    product_id: cartItem.product_id,
                    quantity: cartItem.quantity,
                    product: {
                        id: cartItem.product.id,
                        product_name: cartItem.product.product_name,
                        product_description: cartItem.product.product_description,
                        image_url: cartItem.product.image_url,
                        sale_price: cartItem.product.sale_price,
                        stock_quantity: cartItem.product.stock_quantity,
                        category: cartItem.product.category
                    }
                });

                return acc;
            }, {});

            for (const shopId in shopGroupedCarts) {
                const shop = await shopRepository.getShopById(parseInt(shopId));
                shopGroupedCarts[shopId].shop_info = {
                    shop_id: shop.shop_id,
                    shop_name: shop.shop_name,
                    shop_logo: shop.shop_logo,
                    shop_address: shop.shop_address
                };
            }

            const formattedResult = Object.values(shopGroupedCarts);

            return formattedResult;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    // async createCart(cart) {
    //     try {
    //         const cartExist = await cartRepository.getCartByUserAndProduct(cart.user_id, cart.product_id);
    //         if (cartExist) {
    //             cartExist.quantity += 1;
    //             const result = await cartRepository.updateCart(cartExist);
    //             return result;
    //         }
    //         const result = await cartRepository.createCart(cart);
    //         return result;
    //     } catch (error) {
    //         throw new Error(`Error: ${error.message}`);
    //     }
    // }

    // async getCountCartByUserId(userId) {
    //     try {
    //         const result = await cartRepository.getCountCartByUserId(userId);
    //         return result;
    //     } catch (error) {
    //         throw new Error(`Error: ${error.message}`);
    //     }
    // }

    async createCart(cart) {
        try {
            const cartExist = await cartRepository.getCartByUserAndProduct(cart.user_id, cart.product_id);
            if (cartExist) {
                cartExist.quantity += 1;
                const result = await cartRepository.updateCart(cartExist);
                return result;
            }
            const result = await cartRepository.createCart(cart);
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getCountCartByUserId(userId) {
        try {
            const result = await cartRepository.getCountCartByUserId(userId);
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async updateCartQuantity(cartId, quantity) {
        try {
            const cart = await db.Cart.findByPk(cartId, {
                include: [{ model: db.Product, as: 'product' }]
            });
            if (!cart) throw new Error('Mục giỏ hàng không tồn tại.');
            if (cart.is_ordered) throw new Error('Không thể cập nhật giỏ hàng đã đặt.');
            const product = cart.product;
            if (!product) throw new Error('Product not found.');
            if (quantity < 1) throw new Error('Số lượng phải lớn hơn 0.');
            if (quantity > product.stock_quantity) {
                throw new Error(`Số lượng vượt quá kho (${product.stock_quantity} sản phẩm).`);
            }
            return cartRepository.updateCart({ id: cart.id, quantity });
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async removeCartItem(cartId) {
        try {
            return cartRepository.removeCartItem(cartId);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async removeMultipleCartItems(cartIds) {
        try {
            return cartRepository.removeMultipleCartItems(cartIds);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}

module.exports = new CartService();
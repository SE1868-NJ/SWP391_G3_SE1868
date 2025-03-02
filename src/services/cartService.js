const cartRepository = require('../repositories/CartRepository');
const voucherRepository = require('../repositories/VoucherRepository');
const db = require('../models');

class CartService {
    constructor() { }

    async getCartsByUserId(userId) {
        try {
            const carts = await cartRepository.getCartsByUserId(userId);
            const shopGroupedCarts = carts.reduce((acc, cartItem) => {
                const shopId = cartItem.product.shop_id;
                if (!acc[shopId]) {
                    acc[shopId] = {
                        shop_info: {
                            shop_id: cartItem.product.shop_id,
                            shop_name: cartItem.product.shop.shop_name,
                            shop_logo: cartItem.product.shop.shop_logo,
                            shop_address: cartItem.product.shop.shop_address,
                        },
                        items: [],
                    };
                }
                acc[shopId].items.push({
                    cart_id: cartItem.cart_id,
                    product_id: cartItem.product_id,
                    quantity: cartItem.quantity,
                    product: {
                        id: cartItem.product.product_id,
                        product_name: cartItem.product.product_name,
                        product_description: cartItem.product.product_description,
                        image_url: cartItem.product.image_url,
                        sale_price: cartItem.product.sale_price,
                        stock_quantity: cartItem.product.stock_quantity,
                        category: cartItem.product.category,
                    },
                    applied_vouchers: [],
                });

                return acc;
            }, {});

            for (const shopId in shopGroupedCarts) {
                for (const item of shopGroupedCarts[shopId].items) {
                    const cartItem = await cartRepository.getCartItemWithVouchers(item.cart_id);
                    if (cartItem && cartItem.vouchers && Array.isArray(cartItem.vouchers)) {
                        item.applied_vouchers = cartItem.vouchers
                            .filter(voucher => voucher && typeof voucher === 'object')
                            .map(voucher => ({
                                code: voucher.code,
                                discount_rate: voucher.discount_rate,
                            }));
                    }
                }
            }

            return Object.values(shopGroupedCarts);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
    async addToCart(cartData) {
        try {
            // Kiểm tra các trường bắt buộc
            if (!cartData.user_id || !cartData.product_id) {
                throw new Error('Missing required fields: user_id and product_id are required.');
            }
            if (typeof cartData.quantity !== 'number' || cartData.quantity < 1) {
                cartData.quantity = 1; // Gán mặc định nếu quantity không hợp lệ
            }

            const cartExist = await cartRepository.getCartByUserAndProduct(cartData.user_id, cartData.product_id);
            if (cartExist) {
                const newQuantity = cartExist.quantity + 1;
                const product = await db.Product.findByPk(cartData.product_id);
                if (!product) {
                    throw new Error('Product not found.');
                }
                if (newQuantity > product.stock_quantity) {
                    throw new Error(`Số lượng vượt quá kho (${product.stock_quantity} sản phẩm).`);
                }
                cartExist.quantity = newQuantity;
                return cartRepository.updateCart(cartExist);
            }

            const product = await db.Product.findByPk(cartData.product_id);
            if (!product) {
                throw new Error('Product not found.');
            }
            if (cartData.quantity > product.stock_quantity) {
                throw new Error(`Số lượng vượt quá kho (${product.stock_quantity} sản phẩm).`);
            }
            return cartRepository.createCart(cartData);
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
            return cartRepository.updateCart({ cart_id: cart.cart_id, quantity });
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

    async applyVoucher(userId, storeId, voucherCode) {
        try {
            const carts = await cartRepository.getCartsByUserId(userId);
            const storeCarts = carts.filter(cart => cart.product.shop_id === storeId);
            if (!storeCarts.length) {
                throw new Error('Không có sản phẩm nào trong cửa hàng này.');
            }
            const voucher = await voucherRepository.getVoucherByCode(voucherCode, storeId);
            if (!voucher || voucher.code !== voucherCode) {
                throw new Error('Mã voucher không hợp lệ hoặc đã hết hạn.');
            }
            let isVoucherApplied = false;
            for (const cart of storeCarts) {
                const cartItem = await cartRepository.getCartItemWithVouchers(cart.cart_id);
                if (cartItem && cartItem.vouchers && cartItem.vouchers.length > 0) {
                    isVoucherApplied = cartItem.vouchers.some(v => v.code === voucherCode);
                    if (isVoucherApplied) {
                        throw new Error('Mã voucher này đã được áp dụng.');
                    }
                }
            }
            let totalDiscount = 0;
            for (const cart of storeCarts) {
                const cartItem = await cartRepository.getCartItemWithVouchers(cart.cart_id);
                if (cartItem && cartItem.vouchers && cartItem.vouchers.length > 0) {
                    totalDiscount += cartItem.vouchers.reduce((sum, v) => sum + (Number(v.discount_rate) || 0), 0);
                }
            }
            const newDiscount = Number(voucher.discount_rate) || 0;
            totalDiscount += newDiscount;
            if (totalDiscount > 1) {
                throw new Error('Tổng mức giảm giá không thể vượt quá 100%.');
            }
            for (const cart of storeCarts) {
                const existingCartVoucher = await db.CartVoucher.findOne({
                    where: {
                        cart_id: cart.cart_id,
                        voucher_id: voucher.voucher_id
                    }
                });
                if (!existingCartVoucher) {
                    await voucherRepository.applyVoucherToCart(cart.cart_id, voucher.voucher_id);
                }
            }
            const updatedCarts = await cartRepository.getCartsByUserId(userId);
            const updatedStoreCarts = updatedCarts.filter(cart => cart.product.shop_id === storeId);
            const appliedVouchers = [];
            for (const cart of updatedStoreCarts) {
                const cartItem = await cartRepository.getCartItemWithVouchers(cart.cart_id);
                if (cartItem && cartItem.vouchers && cartItem.vouchers.length > 0) {
                    cartItem.vouchers.forEach(v => {
                        if (!appliedVouchers.some(av => av.code === v.code)) {
                            appliedVouchers.push({
                                code: v.code,
                                rate: Number(v.discount_rate) || 0
                            });
                        }
                    });
                }
            }
            return {
                status: 'success',
                data: {
                    message: 'Voucher đã được áp dụng thành công.',
                    voucher: {
                        code: voucher.code,
                        rate: Number(voucher.discount_rate) || 0
                    },
                    appliedVouchers: appliedVouchers
                }
            };
        } catch (error) {
            return {
                status: 'error',
                data: { message: error.message }
            };
        }
    }

    async removeVoucher(cartId, voucherCode) {
        try {
            const cartItem = await cartRepository.getCartItemWithVouchers(cartId);
            if (!cartItem) {
                throw new Error('Mục giỏ hàng không tồn tại.');
            }
            if (!cartItem.vouchers || cartItem.vouchers.length === 0) {
                throw new Error('Không có voucher nào được áp dụng cho mục này.');
            }
            const voucher = cartItem.vouchers.find(v => v.code === voucherCode);
            if (!voucher) {
                throw new Error('Voucher không được áp dụng cho mục này.');
            }
            await voucherRepository.removeVoucherFromCart(cartId, voucher.voucher_id);
            const updatedCartItem = await cartRepository.getCartItemWithVouchers(cartId);
            return {
                status: 'success',
                data: {
                    message: 'Voucher đã được xóa thành công.',
                    voucherCode: voucher.code
                }
            };
        } catch (error) {
            throw new Error(error.message || 'Không thể xóa voucher.');
        }
    }
}

module.exports = new CartService();
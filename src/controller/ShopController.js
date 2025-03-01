const categoryService = require('../services/categoryService');
const productService = require('../services/productService');
const shopService = require('../services/shopService');
const cartService = require('../services/cartService');
const BaseController = require('./BaseController');

class ShopController extends BaseController {

    getCategory = async (req, res) => {
        try {
            const categories = await categoryService.getAllCategory();
            return this.convertToJson(res, 200, categories);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    getAllProduct = async (req, res) => {
        try {
            const products = await productService.getAllProduct();
            return this.convertToJson(res, 200, products);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    getProducts = async (req, res) => {
        try {
            const params = { page: parseInt(req.body.page) };

            const result = await productService.getProducts(params);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    getProductById = async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            const result = await productService.getProductById(id);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    getCartsByUserId = async (req, res) => {
        try {
            const userId = req.params.id;
            const result = await cartService.getCartsByUserId(userId);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    createCart = async (req, res) => {
        try {
            const cart = req.body;

            const result = await productService.createCart(cart);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }


    addToCart = async (req, res) => {
        try {
            const cart = req.body;
            if (!cart || Object.keys(cart).length === 0) {
                throw new Error('Request body is empty.');
            }
            const result = await cartService.addToCart(cart);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    updateCartQuantity = async (req, res) => {
        try {
            const cartId = req.params.cartId;
            const { quantity } = req.body;
            const result = await cartService.updateCartQuantity(cartId, quantity);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    removeCartItem = async (req, res) => {
        try {
            const cartId = req.params.cartId;
            const result = await cartService.removeCartItem(cartId);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    removeMultipleCartItems = async (req, res) => {
        try {
            const { cartIds } = req.body;
            const result = await cartService.removeMultipleCartItems(cartIds);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    applyVoucher = async (req, res) => {
        try {
            const { userId, storeId, voucherCode } = req.body;
            const result = await cartService.applyVoucher(userId, storeId, voucherCode);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    removeVoucher = async (req, res) => {
        try {
            const { cartId, voucherCode } = req.body;
            if (!cartId || !voucherCode) {
                return res.status(400).json({ status: 'error', message: 'Thiếu cartId hoặc voucherCode.' });
            }
            const result = await cartService.removeVoucher(cartId, voucherCode);
            res.status(200).json({ status: 'success', data: result });
        } catch (error) {
            console.error('Lỗi trong removeVoucher controller:', error.message);
            res.status(500).json({ status: 'error', message: error.message || 'Lỗi server nội bộ.' });
        }
    };

    getCountCartByUserId = async (req, res) => {
        try {
            const userId = req.params.id;

            const result = await productService.getCountCartByUserId(userId);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    getShopByUserId = async (req, res) => {
        try {
            const userId = req.params.id;

            const result = await shopService.getShopsByUserId(userId);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }
}

module.exports = new ShopController();
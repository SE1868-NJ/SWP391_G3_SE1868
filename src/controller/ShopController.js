const categoryService = require('../services/categoryService');
const productService = require('../services/productService');
const shopService = require('../services/shopService');
const cartService = require('../services/cartService');
const BaseController = require('./baseController');

class ShopController extends BaseController {
    getCategory = async (req, res) => {
        try {
            const categories = await categoryService.getAllCategory();
            return this.convertToJson(res, 200, categories);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    getAllProduct = async (req, res) => {
        try {
            const products = await productService.getAllProduct();
            return this.convertToJson(res, 200, products);
        } catch (error) {
            return this.handleError(res, error);
        }
    };
    getProducts = async (req, res) => {
        try {
            const params = {
                page: parseInt(req.body.page),
                limit: parseInt(req.body.limit) || 4, // Giữ nguyên mặc định nếu không có limit
                search: req.body.search || "", // Lấy thêm search từ body
                sortPrice: req.body.sortPrice || "asc", // Lấy thêm sortPrice từ body\ categories: req.body.categories || ""
                minPrice: req.body.minPrice || 0, // Giá thấp nhất
                maxPrice: req.body.maxPrice || 10000000, // Giá cao nhất (default rất lớn)
            };

            const result = await productService.getProducts(params);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getProductById = async (req, res) => {
        try {
            const id = parseInt(req.params.id);

            // Tăng search_count chỉ khi product tồn tại
            const product = await productService.getProductById(id);

            if (!product) {
                return this.convertToJson(res, 404, { message: "Product not found" });
            }

            await productService.increaseSearchCount(id);

            this.convertToJson(res, 200, product);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getProductByName = async (req, res) => {
        try {
            const productName = req.params.name;

            const result = await productService.getProductByName(productName);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    createCart = async (req, res) => {
        try {
            const cart = req.body;

            const result = await productService.createCart(cart);
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

    getCountCartByUserId = async (req, res) => {
        try {
            const userId = req.params.id;

            const result = await productService.getCountCartByUserId(userId);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };

    getShopByUserId = async (req, res) => {
        try {
            const userId = req.params.id;

            const result = await shopService.getShopsByUserId(userId);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    };
    getTopSearchedProducts = async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 4; // Mặc định là 4 sản phẩm

            const result = await productService.getMostSearchedProducts(limit);
            return this.convertToJson(res, 200, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    increaseSearchCount = async (req, res) => {
        try {
            const productId = parseInt(req.params.id);
            await productService.increaseSearchCount(productId);
            return this.convertToJson(res, 200, { message: "Search count updated" });
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    getShopHomepage = async (req, res) => {
        try {
            const shopId = parseInt(req.params.id);
            const result = await shopService.getShopHomepage(shopId);
            return this.convertToJson(res, 200, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    getProductsByShopAndCategory = async (req, res) => {
        try {
            const params = {
                shopId: parseInt(req.params.shopId),
                categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : null,
                sort: req.query.sort || 'newest'
            };
            const result = await productService.getProductsByShopAndCategory(params);
            return this.convertToJson(res, 200, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    };

    getFeedbacksByShop = async (req, res) => {
        try {
            const shopId = req.params.id;
            const feedbacks = await shopService.getFeedbacksByShop(shopId);
            return this.convertToJson(res, 200, feedbacks);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

}
module.exports = new ShopController();
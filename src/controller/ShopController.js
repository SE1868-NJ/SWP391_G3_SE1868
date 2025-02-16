const categoryService = require('../services/categoryService');
const productService = require('../services/shopService');
const BaseController = require('./baseController');

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
            const shopId = req.query.shop_id;
            if (shopId) {
                const products = await productService.getAllProductByShopId(shopId);
                return this.convertToJson(res, 200, products);
            }
            const products = await productService.getAllProduct();
            return this.convertToJson(res, 200, products);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    getProductById = async (req, res) => {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);
            return this.convertToJson(res, 200, product);
        } catch (error) {
            return this.handleError(res, error);
        }
    }
    
    createProduct = async (req, res) => {
        try {
            const { body } = req;
            const product = await productService.createProduct(body);
            return this.convertToJson(res, 200, product);
        } catch (error) {
            return this.handleError(res, error);
        }

    }

    updateProduct = async (req, res) => {
        try {
            const { body } = req;
            const { id } = req.params;
            const product = await productService.updateProduct(id, body);
            return this.convertToJson(res, 200, product);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const { id } = req.params;
            const product = await productService.deleteProduct(id);
            return this.convertToJson(res, 200, product);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

}

module.exports = new ShopController();
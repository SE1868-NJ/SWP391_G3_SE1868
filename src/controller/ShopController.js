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
}

module.exports = new ShopController();
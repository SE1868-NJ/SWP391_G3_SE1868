const categoryService = require('../services/categoryService');
const productService = require('../services/productService');
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

    getCartsByUserId = async (req, res) => {
        try {
            const userId = req.params.id;

            const result = await productService.getCartsByUserId(userId);
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

    getCountCartByUserId = async (req, res) => {
        try {
            const userId = req.params.id;

            const result = await productService.getCountCartByUserId(userId);
            this.convertToJson(res, 200, result);
        } catch (error) {
            this.handleError(res, error);
        }
    }
}

module.exports = new ShopController();
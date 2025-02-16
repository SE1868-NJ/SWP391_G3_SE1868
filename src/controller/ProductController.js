const BaseController = require("./baseController");
const productService = require('../services/shopService');

class  ProductController extends BaseController{
    constructor(){
        super();
    }

    getAllProduct = async (req, res) => {
        try {
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

module.exports = new ProductController();
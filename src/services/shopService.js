const productRepository = require('../repositories/ProductRepository');
const categoryRepository = require('../repositories/CategoryRepository');

class ProductService {
    constructor() {

    }
    async getAllProduct() {
        try {
            const dataProduct = await productRepository.getAllProduct();
            for (let data of dataProduct) {
                const category = await categoryRepository.getCategoryById(data.category_id);
                data.dataValues.category_id = category.dataValues;
            }
            return dataProduct;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getProducts(params) {
        try {
            const result = await productRepository.getProducts(params);
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const result = await productRepository.getProductById(id);
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

}

module.exports = new ProductService();
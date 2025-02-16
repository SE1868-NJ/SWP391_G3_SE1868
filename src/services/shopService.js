const productRepository = require('../repositories/ProductRepository');
const categoryRepository = require('../repositories/CategoryRepository');

class ProductService {
    constructor() {

    }
    async getAllProduct() {
        try {
            const dataProduct = await productRepository.getAllProduct();
            // for (let data of dataProduct) {
            //     const category = await categoryRepository.getCategoryById(data.category_id);
            //     data.dataValues.category_id = category.dataValues;
            // }
            return dataProduct;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getAllProductByShopId(shopId) {
        try {
            const dataProduct = await productRepository.getAllProductByShopId(shopId);
            for (let data of dataProduct) {
                const category = await categoryRepository.getCategoryById(data.category_id);
                data.dataValues.category_id = category.dataValues;
            }
            return dataProduct;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const dataProduct = await productRepository.getProductById(id);
            if (!dataProduct) {
                throw new Error(`Product with id ${id} not found`);
            }
            const category = await categoryRepository.getCategoryById(dataProduct.category_id);
            dataProduct.dataValues.category_id = category.dataValues;
            return dataProduct;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }

    }

    async createProduct(product) {
        try {
            return await productRepository.create(product);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async updateProduct(id, product) {
        try {
            return await productRepository.update(id, product);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            return await productRepository.delete(id);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}

module.exports = new ProductService();
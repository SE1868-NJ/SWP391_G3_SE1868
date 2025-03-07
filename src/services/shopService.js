const shopRepository = require('../repositories/ShopRepository');
const productRepository = require('../repositories/ProductRepository');

class ShopService {
    constructor() { }

    async getShopsByUserId(user_id) {
        try {
            return await shopRepository.getShopsByUserId(user_id);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getShopHomepage(shopId) {
        try {
            return await shopRepository.getShopHomepage(shopId);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async getProductsByShopAndCategory(params) {
        try {
            return await productRepository.getProductsByShopAndCategory(params);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async checkFollowStatus(userId, shopId) {
        try {
            return await shopRepository.checkFollowStatus(userId, shopId);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async toggleFollowShop(userId, shopId) {
        try {
            return await shopRepository.toggleFollowShop(userId, shopId);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}

module.exports = new ShopService();
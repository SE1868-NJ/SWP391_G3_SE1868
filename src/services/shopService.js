const shopRepository = require('../repositories/shopRepository');

class ShopService {
    constructor() {
    }

    async getShopsByUserId(user_id) {
        try {
            const data = shopRepository.getShopsByUserId(user_id);
            return data;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}

module.exports = new ShopService();
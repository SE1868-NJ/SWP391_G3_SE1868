const db = require('../models');

class ShopRepository {
    constructor() {
    }

    async getShopById(shopId) {
        return await db.Shop.findByPk(shopId);
    }
}

module.exports = new ShopRepository();
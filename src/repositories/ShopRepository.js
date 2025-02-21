const db = require('../models');

class ShopRepository {
    constructor() {
    }

    async getShopById(shopId) {
        return await db.Shop.findByPk(shopId);
    }

    async getShopsByUserId(userId) {
        return await db.Shop.findAll({
            where: {
                user_id: userId
            }
        });
    }
}

module.exports = new ShopRepository();
const db = require('../models');

class ShopRepository {
    constructor() { }

    async getShopById(shopId) {
        return await db.Shop.findByPk(shopId);
    }

    async getShopsByUserId(userId) {
        return await db.Shop.findAll({
            where: { user_id: userId }
        });
    }

    async updateShop(shopId, shopData) {
        const shop = await db.Shop.findByPk(shopId);
        if (!shop) throw new Error('Shop not found');
        return await shop.update(shopData);
    }

}

module.exports = new ShopRepository();
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

    async getFeedbacksByShop(shopId) {
        return await db.Feedback.findAll({
            include: [
                {
                    model: db.Product,
                    as: 'product',
                    where: { shop_id: shopId }
                },
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['user_id', 'full_name']
                }
            ]
        });
    }

}

module.exports = new ShopRepository();
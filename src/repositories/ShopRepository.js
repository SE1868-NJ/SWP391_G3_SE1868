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

    async getFeedbacksByShop(shopId, startDate, endDate) {
        const whereClause = {
            '$product.shop_id$': shopId, // Lọc theo shopId từ bảng Product
        };
    
        if (startDate && endDate) {
            whereClause.created_at = {
                [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }
    
        return await db.Feedback.findAll({
            where: whereClause,
            include: [
                {
                    model: db.Product,
                    as: 'product',
                },
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['user_id', 'full_name'],
                },
            ],
        });
    }
    
}

module.exports = new ShopRepository();
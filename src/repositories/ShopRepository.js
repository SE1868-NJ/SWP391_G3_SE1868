const db = require('../models');
const { Op } = require("sequelize");
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

    async getSellerProducts(shop_id, { page = 1, limit = 10, search = '', sort = 'product_name', order = 'asc' }) {
        try {
            const offset = (page - 1) * limit;
    
            const result = await db.Product.findAndCountAll({
                attributes: [
                    'id',
                    'product_name',
                    'product_description',
                    'import_price',
                    'sale_price',
                    'stock_quantity',
                    'image_url',
                ],
                include: [
                    {
                        model: db.Category,
                        as: 'category',
                        attributes: ['name'],
                    }
                ],
                where: {
                    shop_id,
                    status: 'active', 
                    product_name: { [Op.like]: `%${search}%` }
                },
                order: [[sort, order]],
                limit,
                offset
            });
    
            return {
                total: result.count,
                products: result.rows
            };
        } catch (error) {
            throw new Error(`Error fetching seller products: ${error.message}`);
        }
    }
    
}

module.exports = new ShopRepository();
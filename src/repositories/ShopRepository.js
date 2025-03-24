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
                    'sale_price',
                    'stock_quantity',
                    'image_url',
                    [
                        db.sequelize.literal(`(
                            SELECT COALESCE(SUM(order_details.price * order_details.quantity), 0)
                            FROM order_details
                            WHERE order_details.product_id = Product.id
                        )`),
                        'revenue'
                    ]
                ],

                where: {
                    shop_id,
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
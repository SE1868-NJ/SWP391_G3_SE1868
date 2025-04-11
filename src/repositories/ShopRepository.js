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

    async findOrCreateShopByUserId(userId, userName) {
        let shop = await db.Shop.findOne({ where: { user_id: userId } });
        if (!shop) {
            shop = await db.Shop.create({
                user_id: userId,
                shop_name: `${userName}'s Shop`,
            });
        }
        return shop;
    }

    async getShopRatings(shopId) {
        try {
            const query = `
        SELECT 
          AVG(f.rating) as average_rating,
          COUNT(f.id) as rating_count
        FROM Feedbacks f
        JOIN Products p ON f.product_id = p.id
        WHERE p.shop_id = :shopId
      `;

            const result = await db.sequelize.query(query, {
                replacements: { shopId },
                type: db.sequelize.QueryTypes.SELECT
            });

            return {
                average_rating: parseFloat(result[0]?.average_rating || 0).toFixed(1),
                rating_count: parseInt(result[0]?.rating_count || 0)
            };
        } catch (error) {
            throw new Error(`Error getting shop ratings: ${error.message}`);
        }
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
const db = require('../models');

class CategoryRepository {
    constructor() {
    }

    async getAllCategory() {
        return await db.Category.findAll();
    }

    async getCategoryById(id) {
        return await db.Category.findByPk(id);
    }
    async getCategoriesWithProductCount(shopId) {
        return await db.Category.findAll({
            attributes: [
                'id',
                'name',
                'description',
                [db.sequelize.fn('COUNT', db.sequelize.col('products.id')), 'product_count']
            ],
            include: [
                {
                    model: db.Product,
                    as: 'products',
                    attributes: [],
                    where: { shop_id: shopId },
                    required: false
                }
            ],
            group: ['Category.id'],
            having: db.sequelize.literal('product_count > 0')
        });
    }

    async getCategoriesByShopId(shopId) {
        try {
            const query = `
        SELECT 
          c.id, 
          c.name, 
          COUNT(p.id) as product_count 
        FROM Categories c
        LEFT JOIN Products p ON c.id = p.category_id AND p.shop_id = :shopId
        GROUP BY c.id
        ORDER BY product_count DESC
      `;

            const categories = await db.sequelize.query(query, {
                replacements: { shopId },
                type: db.sequelize.QueryTypes.SELECT
            });

            return categories;
        } catch (error) {
            throw new Error(`Error getting categories by shop: ${error.message}`);
        }
    }
}

module.exports = new CategoryRepository();
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
}

module.exports = new CategoryRepository();
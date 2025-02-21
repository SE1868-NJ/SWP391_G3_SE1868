const db = require('../models');

class ProductRepository {
    constructor() {
    }

    async getAllProduct() {
        return await db.Product.findAll();
    }

    async getProducts(params) {
        const { page = 1, limit = 4 } = params;

        const whereClause = {
            status: 'active'
        };
        const { count, rows } = await db.Product.findAndCountAll({
            where: whereClause,
            include: [{
                model: db.Category,
                as: 'category'
            }],
            limit: parseInt(limit),
            offset: (page - 1) * limit,
        });

        return {
            items: rows,
            metadata: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    async getProductById(id) {
        return await db.Product.findByPk(id, {
            include: [{
                model: db.Shop,
                as: 'shop'
            }]
        });
    }
    
    
}

module.exports = new ProductRepository();
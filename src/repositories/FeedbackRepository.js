const { where } = require('sequelize');
const db = require('../models');

class FeedbackRepository {
    constructor() {
    }

    async getFeedBacksByProductId(params) {
        const page = 1;
        const limit = 4;
        const product_id = params;
    
        const { count, rows } = await db.Feedback.findAndCountAll({
            where: {
                product_id: product_id
            },
            include: [
                {
                    model: db.User,
                    as: 'user'
                },
                {
                    model: db.FeedbackMedia,
                    as: 'media'
                }
            ],
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
}

module.exports = new FeedbackRepository();
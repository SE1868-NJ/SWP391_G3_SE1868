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

    async countFeedbacksByProductId(product_id) {
        const count = await db.Feedback.count({
            where: {
                product_id: product_id
            }
        });

        return count;
    }
    async createFeedback(feedbackData) {
        return await db.Feedback.create(feedbackData);
    }

    async createFeedbackMedia(mediaData) {
        return await db.FeedbackMedia.bulkCreate(mediaData);
    }
    async getFeedbackById(feedbackId) {
        return await db.Feedback.findOne({
            where: { id: feedbackId },
            include: [
                {
                    model: db.User,
                    as: 'user',
                },
                {
                    model: db.FeedbackMedia,
                    as: 'media',
                },
                {
                    model: db.Product,
                    as: 'product',
                    include: {
                        model: db.Category,
                        as: 'category',
                    },
                    include: {
                        model: db.Shop,
                        as: 'shop',
                    },
                },
            ],
        });
    }
    async getProductFeedbackStats(productId) {
        try {
            const result = await db.sequelize.query(`
        SELECT 
          AVG(rating) as average_rating,
          COUNT(id) as rating_count
        FROM Feedbacks
        WHERE product_id = :productId
      `, {
                replacements: { productId },
                type: db.sequelize.QueryTypes.SELECT
            });

            return {
                average_rating: parseFloat(result[0]?.average_rating || 0).toFixed(1),
                rating_count: parseInt(result[0]?.rating_count || 0)
            };
        } catch (error) {
            throw new Error(`Error getting product feedback stats: ${error.message}`);
        }
    }
}

module.exports = new FeedbackRepository();
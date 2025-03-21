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
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!feedbackData.user_id || !feedbackData.product_id) {
                throw new Error('user_id và product_id là bắt buộc');
            }
    
            // Tạo transaction để đảm bảo tính toàn vẹn dữ liệu
            const result = await db.sequelize.transaction(async (t) => {
                // Tạo mới feedback trong bảng feedback
                const feedback = await db.Feedback.create({
                    user_id: feedbackData.user_id,
                    product_id: feedbackData.product_id,
                    rating: feedbackData.rating,
                    comment: feedbackData.comment,
                    is_update: feedbackData.is_update || 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, { transaction: t });
    
                // Nếu có media đi kèm feedback
                if (feedbackData.media && Array.isArray(feedbackData.media) && feedbackData.media.length > 0) {
                    const mediaPromises = feedbackData.media.map(mediaItem => {
                        return db.FeedbackMedia.create({
                            feedback_id: feedback.id,
                            media_url: mediaItem.media_url,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }, { transaction: t });
                    });
                    await Promise.all(mediaPromises);
                }
    
                // Cập nhật điểm đánh giá trung bình của sản phẩm
                await this.updateProductRating(feedbackData.product_id, t);
    
                return feedback.id;
            });
    
            // Lấy thông tin feedback vừa tạo kèm user và media
            const createdFeedback = await db.Feedback.findOne({
                where: { id: result },
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id', 'name', 'avatar'] // Chỉ lấy các trường cần thiết
                    },
                    {
                        model: db.FeedbackMedia,
                        as: 'media'
                    }
                ]
            });
    
            return createdFeedback;
        } catch (error) {
            console.error('Error creating feedback:', error);
            throw new Error(`Không thể tạo đánh giá: ${error.message}`);
        }
    }
    
    // Hàm cập nhật điểm đánh giá trung bình cho sản phẩm
    async updateProductRating(productId, transaction) {
        try {
            // Tính điểm đánh giá trung bình
            const avgRating = await db.Feedback.findOne({
                attributes: [
                    [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'averageRating'],
                    [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalRatings']
                ],
                where: { product_id: productId }
            }, { transaction });
    
            // Cập nhật điểm đánh giá trong bảng Product
            await db.Product.update({
                average_rating: avgRating.dataValues.averageRating || 0,
                total_ratings: avgRating.dataValues.totalRatings || 0,
                updatedAt: new Date()
            }, {
                where: { id: productId },
                transaction
            });
    
            return true;
        } catch (error) {
            console.error('Error updating product rating:', error);
            throw error;
        }
    }
}

module.exports = new FeedbackRepository();
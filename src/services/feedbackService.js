const feedbackRepository = require('../repositories/FeedbackRepository');

class FeedbackService {
    constructor() {
    }

    async getFeedBacks(productId) {
        try {
            if (!productId) {
                throw new Error('Product ID is required');
            }


            const { items, metadata } = await feedbackRepository.getFeedBacksByProductId(productId);

            const total = metadata.total;
            const counts = {
                1: 0, 2: 0, 3: 0, 4: 0, 5: 0
            };
            let ratingSum = 0;
            let mediaCount = 0;
            let commentsCount = 0;

            items.forEach(feedback => {
                counts[feedback.rating] += 1;
                ratingSum += feedback.rating;
                if (feedback.media && feedback.media.length > 0) {
                    mediaCount += feedback.media.length;
                }
                if (feedback.comment && feedback.comment.trim()) {
                    commentsCount += 1;
                }
            });
            const rating = total > 0 ? Number((ratingSum / items.length).toFixed(1)) : 0;

            const reviews = items.map(feedback => ({
                id: feedback.id,
                user: feedback.user?.fullName || 'Anonymous',
                avatar: feedback.user?.avatar || null,
                rating: feedback.rating,
                date: new Date(feedback.created_at).toISOString().split('T')[0],
                // variant: feedback.variant || null,
                // material: feedback.material || null,
                comment: feedback.comment || '',
                images: feedback.media?.map(m => m.media_url) || [],
                // sellerReply: feedback.sellerReply || null
            }));

            return {
                rating,
                total,
                counts,
                commentsCount,
                mediaCount,
                reviews,
                metadata: {
                    total: metadata.total,
                    page: metadata.page,
                    limit: metadata.limit,
                    totalPages: metadata.totalPages
                }
            };

        } catch (error) {
            throw new Error(`Failed to get feedback data: ${error.message}`);
        }
    }
    async createFeedback(feedbackData) {
        try {
            // Validation: Kiểm tra các trường bắt buộc
            if (!feedbackData.user_id) {
                throw new Error('User ID là bắt buộc');
            }
            if (!feedbackData.product_id) {
                throw new Error('Product ID là bắt buộc');
            }
            if (!feedbackData.rating || feedbackData.rating < 1 || feedbackData.rating > 5) {
                throw new Error('Đánh giá phải từ 1 đến 5 sao');
            }
            if (!feedbackData.comment || feedbackData.comment.trim() === '') {
                throw new Error('Nội dung đánh giá là bắt buộc');
            }
    
            // Kiểm tra media nếu có
            const mediaArray = [];
            if (feedbackData.media && Array.isArray(feedbackData.media)) {
                for (const mediaItem of feedbackData.media) {
                    if (!mediaItem.media_url || mediaItem.media_url.trim() === '') {
                        throw new Error('URL của hình ảnh là bắt buộc cho mỗi mục media');
                    }
                    // Kiểm tra độ dài media_url không vượt quá 255 ký tự
                    if (mediaItem.media_url.length > 255) {
                        throw new Error('URL của hình ảnh không được vượt quá 255 ký tự');
                    }
                    mediaArray.push({
                        media_url: mediaItem.media_url.trim()
                    });
                }
            }
    
            // Chuẩn bị dữ liệu để gửi đến repository
            const feedbackPayload = {
                user_id: feedbackData.user_id,
                product_id: feedbackData.product_id,
                rating: feedbackData.rating,
                comment: feedbackData.comment.trim(),
                is_update: feedbackData.is_update || 0,
                media: mediaArray.length > 0 ? mediaArray : null
            };
    
            // Gọi repository để tạo feedback
            const newFeedback = await feedbackRepository.createFeedback(feedbackPayload);
    
            // Kiểm tra nếu feedback được tạo thành công
            if (!newFeedback) {
                throw new Error('Không thể tạo đánh giá, vui lòng thử lại sau');
            }
    
            // Format dữ liệu trả về
            return {
                success: true,
                feedback: {
                    id: newFeedback.id,
                    user: {
                        id: newFeedback.user?.id,
                        name: newFeedback.user?.name || 'Vô danh',
                        avatar: newFeedback.user?.avatar || null
                    },
                    product_id: newFeedback.product_id,
                    rating: newFeedback.rating,
                    comment: newFeedback.comment || '',
                    date: formatDate(newFeedback.createdAt),
                    images: newFeedback.media?.map(m => m.media_url) || [],
                    created_at: newFeedback.createdAt,
                    updated_at: newFeedback.updatedAt
                }
            };
        } catch (error) {
            console.error('Service error - createFeedback:', error);
            throw new Error(`Không thể tạo đánh giá: ${error.message}`);
        }
    }
}

module.exports = new FeedbackService();
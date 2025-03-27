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
    async submitFeedback(feedbackData) {
        try {
            const { user_id, product_id, rating, comment, images } = feedbackData;

            // Validate input
            if (!user_id || !product_id || !rating) {
                throw new Error('User ID, Product ID, and Rating are required');
            }
            if (rating < 1 || rating > 5) {
                throw new Error('Rating must be between 1 and 5');
            }

            // Create the feedback record
            const newFeedback = await feedbackRepository.createFeedback({
                user_id,
                product_id,
                rating,
                comment,
                is_update: false, // First submission, so is_update is false
            });

            // If there are images, save them to the Feedback_media table
            if (images && images.length > 0) {
                await feedbackRepository.createFeedbackMedia(
                    images.map((media_url) => ({
                        feedback_id: newFeedback.id,
                        media_url,
                    }))
                );
            }

            // Fetch the newly created feedback with associated user and media for the response
            const feedbackWithDetails = await feedbackRepository.getFeedbackById(newFeedback.id);

            return {
                id: feedbackWithDetails.id,
                user: feedbackWithDetails.user?.fullName || 'Anonymous',
                avatar: feedbackWithDetails.user?.avatar || null,
                rating: feedbackWithDetails.rating,
                date: new Date(feedbackWithDetails.created_at).toISOString().split('T')[0],
                comment: feedbackWithDetails.comment || '',
                images: feedbackWithDetails.media?.map((m) => m.media_url) || [],
            };
        } catch (error) {
            throw new Error(`Failed to get feedback data: ${error.message}`);
        }
    }
}

module.exports = new FeedbackService();
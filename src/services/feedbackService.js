const feedbackRepository = require('../repositories/feedbackRepository');

class FeedbackService {
    constructor() {
    }

    async getFeedBacks(params) {
        try {
            const result = await feedbackRepository.getFeedBacksByProductId(params);
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}

module.exports = new FeedbackService();
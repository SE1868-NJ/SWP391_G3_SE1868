const conversationRepository = require('../repositories/conversationRepository');

class ConversationService {
    constructor() {
    }

    async getUserConversations(userId) {
        return await conversationRepository.getConversationsByUser(userId);
    }

    async getShopConversations(shopId) {
        return await conversationRepository.getConversationsByShop(shopId);
    }
}

module.exports = new ConversationService();
const db = require('../models');

class ConversationRepository {
    constructor() {
    }
    async getConversationsByUser(userId) {
        return await db.Conversation.findAll({
            where: { user_id: userId },
            // order: [['updated_at', 'DESC']]
        });
    }

    async getConversationsByShop(shopId) {
        return await db.Conversation.findAll({
            where: { shop_id: shopId },
            // order: [['updated_at', 'DESC']]
        });
    }

    async createConversation(userId, shopId) {
        return await db.Conversation.create({
            user_id: userId,
            shop_id: shopId,
            status: 'active'
        });
    }

    async findConversationByUserAndShop(userId, shopId) {
        return await this.Conversation.findOne({
            where: {
                user_id: userId,
                shop_id: shopId,
                status: 'active'
            }
        });
    }
    async findConversationById(conversationId) {
        return await db.Conversation.findByPk(conversationId);
    }
}

module.exports = new ConversationRepository();
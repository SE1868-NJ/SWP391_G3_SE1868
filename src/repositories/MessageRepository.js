const db = require('../models');

class MessageRepository {
    constructor() {
    }

    async getMessagesByConversation(conversationId, limit, offset) {
        return await db.Message.findAll({
            where: { conversation_id: conversationId },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    }

    async countMessagesByConversation(conversationId) {
        return await db.Message.count({
            where: { conversation_id: conversationId }
        });
    }

    async createMessage(data) {
        return await db.Message.create(data);
    }

    

}

module.exports = new MessageRepository();
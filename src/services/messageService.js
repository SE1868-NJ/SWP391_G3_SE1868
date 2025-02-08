const MessageRepository = require('../repositories/messageRepository');
const ConversationRepository = require('../repositories/conversationRepository');

class MessageService {
    async fetchMessages(conversationId, limit, offset) {
        const messages = await MessageRepository.getMessagesByConversation(conversationId, limit, offset);

        const totalMessages = await MessageRepository.countMessagesByConversation(conversationId);

        return {
            messages,
            totalMessages,
            hasMore: offset + messages.length < totalMessages
        };
    }

    async sendMessage(conversationId, senderId, senderType, messageText) {
        const conversation = await ConversationRepository.findConversationById(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        return await MessageRepository.createMessage({
            conversation_id: conversationId,
            sender_id: senderId,
            sender_type: senderType,
            message_text: messageText
        });
    }
};

module.exports = new MessageService();
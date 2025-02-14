const { json } = require('sequelize');
const conversationRepository = require('../repositories/conversationRepository');
const shopRepository = require('../repositories/shopRepository');

class ConversationService {
    constructor() {
    }

    async getUserConversations(userId) {
        let data = [];
        try {
            data = await conversationRepository.getConversationsByUser(userId);
            for (let conversation of data) {
                const shop = await shopRepository.getShopById(conversation.shop_id);
                conversation.dataValues.shop = shop.dataValues;
            }
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
        return data;
    }

    async getShopConversations(shopId) {
        try {
            return await conversationRepository.getConversationsByShop(shopId);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}

module.exports = new ConversationService();
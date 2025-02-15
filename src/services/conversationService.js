const conversationRepository = require('../repositories/conversationRepository');
const shopRepository = require('../repositories/shopRepository');
const userRepository = require('../repositories/userRepository');

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
        let data = [];
        try {
            data = await conversationRepository.getConversationsByShop(shopId);
            for (let conversation of data) {
                const user = await userRepository.getUserById(conversation.user_id);
                conversation.dataValues.user = user.dataValues;
            }
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
        return data;
    }
}

module.exports = new ConversationService();
const conversationService = require('../services/conversationService');
const BaseController = require('./baseController');

class ConversationController extends BaseController {
    getShopConversations = async (req, res) => {
        try {
            const { shopId } = req.params;
            console.log(shopId);
            const conversations = await conversationService.getShopConversations(shopId);
            return this.convertToJson(res, 200, conversations);
        } catch (error) {
            return this.handleError(res, error);
        }
    }
    
    getUserConversations = async (req, res) => {
        try {
            const { userId } = req.params;
            const conversations = await conversationService.getUserConversations(userId);
            return this.convertToJson(res, 200, conversations);
        } catch (error) {
            return this.handleError(res, error);
        }
    }
}

module.exports = new ConversationController();
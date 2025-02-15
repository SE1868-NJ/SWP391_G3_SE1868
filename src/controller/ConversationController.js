const conversationService = require('../services/conversationService');
const categoryService = require('../services/categoryService');
const BaseController = require('./baseController');

class ConversationController extends BaseController {
    getShopConversations = async (req, res) => {
        try {
            const { shopId } = req.params;
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

    getCategory = async (req, res) => {
        try {
            const categories = await categoryService.getAllCategory();
            return this.convertToJson(res, 200, categories);
        } catch (error) {
            return this.handleError(res, error);
        }
    }
}

module.exports = new ConversationController();
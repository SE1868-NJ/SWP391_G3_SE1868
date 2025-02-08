const MessageService = require('../services/messageService');
const BaseController = require('./baseController');

class MessageController extends BaseController {
    getMessages = async (req, res) => {
        try {
            // console.log(req);
            const { conversationId } = req.params;
            const { limit, offset } = req.query;

            const result = await MessageService.fetchMessages(conversationId, parseInt(limit), parseInt(offset));

            return this.convertToJson(res, 200, result);
        } catch (error) {
            console.error('Lỗi khi lấy tin nhắn:', error);
            return this.handleError(res, error);
        }
    }
};

module.exports = new MessageController();
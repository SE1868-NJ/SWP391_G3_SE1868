const express = require('express');
const router = express.Router();
const MessageController = require('../controller/MessageController');

router.get('/getMessage/:conversationId', MessageController.getMessages);
// router.get('/shop/:shopId', MessageController.getShopConversations);

module.exports = router;
const express = require('express');
const router = express.Router();
const conversationController = require('../controller/ConversationController');

router.get('/user/:userId', conversationController.getUserConversations);
router.get('/shop/:shopId', conversationController.getShopConversations);

module.exports = router;
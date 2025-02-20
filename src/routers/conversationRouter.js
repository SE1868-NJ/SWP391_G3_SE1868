const express = require('express');
const router = express.Router();
const conversationController = require('../controller/ConversationController');

router.get('/user/:userId', conversationController.getUserConversations);
router.get('/shop/:shopId', conversationController.getShopConversations);
router.get('/:userId/:shopId', conversationController.getConservation);

module.exports = router;
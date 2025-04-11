const express = require('express');
const router = express.Router();
const EmailController = require('../controller/EmailController');

router.post('/send-order-success-email', EmailController.sendOrderSuccessEmail);
router.post('/send-promotion-to-followers', EmailController.sendPromotionToFollowers);

module.exports = router;

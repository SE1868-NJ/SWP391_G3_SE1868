const express = require('express');
const router = express.Router();
const feedBackController = require('../controller/FeedBackController');

router.get('/get_feedbacks_by_product/:id', feedBackController.getFeedBacksByProductId);
router.post('/feedbacks',feedBackController.createFeedback);

module.exports = router;

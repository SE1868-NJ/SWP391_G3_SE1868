const express = require('express');
const router = express.Router();
const feedBackController = require('../controller/FeedBackController');
//const {verifyToken} = require('../middlewares/auth.middleware');

router.get('/get_feedbacks_by_product/:id', feedBackController.getFeedBacksByProductId);
router.post('/create',feedBackController.submitFeedback);

module.exports = router;

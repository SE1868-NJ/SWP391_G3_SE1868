const express = require('express');
const router = express.Router();
const shopController = require('../controller/ShopController');
const feedBackController = require('../controller/FeedBackController');

router.get('/category/get_list_category', shopController.getCategory);
router.post('/product/get_list_product', shopController.getProducts);
router.get('/product/get_feedbacks_by_product', feedBackController.getFeedBacks);

module.exports = router;
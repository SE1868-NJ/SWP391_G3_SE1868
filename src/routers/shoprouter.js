const express = require('express');
const router = express.Router();
const shopController = require('../controller/ShopController');

router.get('/category/get_list_category', shopController.getCategory);
router.get('/product/get_list_product', shopController.getAllProduct);

module.exports = router;
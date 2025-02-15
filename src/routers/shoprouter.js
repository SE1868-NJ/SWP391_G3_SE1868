const express = require('express');
const router = express.Router();
const shopController = require('../controller/ShopController');

router.get('/category/get_list_category', shopController.getCategory);
router.post('/product/get_list_product', shopController.getProducts);

module.exports = router;
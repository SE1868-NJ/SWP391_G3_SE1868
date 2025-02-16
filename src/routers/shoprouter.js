const express = require('express');
const router = express.Router();
const shopController = require('../controller/ShopController');

router.get('/category/get_list_category', shopController.getCategory);
router.get('/product/get_list_product', shopController.getAllProduct);
router.get('/product/get_product/:id', shopController.getProductById);
router.post('/product/create_product', shopController.createProduct);
router.put('/product/update_product/:id', shopController.updateProduct);
router.delete('/product/delete_product/:id', shopController.deleteProduct);

module.exports = router;
const express = require('express');
const router = express.Router();
const shopController = require('../controller/ShopController');
const feedBackController = require('../controller/FeedBackController');

//category
router.get('/category/get_list_category', shopController.getCategory);

//product
router.post('/product/get_list_product', shopController.getProducts);
router.get('/product/get_feedbacks_by_product/:id', feedBackController.getFeedBacksByProductId);
router.get('/product/get_product_by_id/:id', shopController.getProductById);
// cart
router.get('/cart/get_cart_by_user/:id', shopController.getCartsByUserId);
router.post('/cart/add_to_cart', shopController.createCart);
router.get('/cart/get_count_cart_by_user/:id', shopController.getCountCartByUserId);

// Shop || seller
router.get('/get_shop_by_user/:id', shopController.getShopByUserId);

module.exports = router;

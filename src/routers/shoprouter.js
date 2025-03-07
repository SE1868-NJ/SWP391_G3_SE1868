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
router.get('/product/get_product_by_name/:name', shopController.getProductByName);
router.get('/product/get_top_searched_products', shopController.getTopSearchedProducts);
// cart
router.get('/cart/get_cart_by_user/:id', shopController.getCartsByUserId);
router.post('/cart/add_to_cart', shopController.createCart);
router.post('/cart/update_quantity/:cartId', shopController.updateCartQuantity);
router.post('/cart/remove_item/:cartId', shopController.removeCartItem);
router.post('/cart/remove_multiple', shopController.removeMultipleCartItems);

router.get('/cart/get_count_cart_by_user/:id', shopController.getCountCartByUserId);

// Shop || seller
router.get('/get_shop_by_user/:id', shopController.getShopByUserId);

// Shop Homepage
router.get('/:id/homepage', shopController.getShopHomepage);

// Shop Products
router.get('/:shopId/products', shopController.getProductsByShopAndCategory);

// Follow Shop
// router.get('/follow-status/:userId/:shopId', shopController.checkFollowStatus);
// router.post('/toggle-follow', shopController.toggleFollowShop);
module.exports = router;
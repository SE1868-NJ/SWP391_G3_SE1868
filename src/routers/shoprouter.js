const express = require('express');
const router = express.Router();
const multer = require('multer');
const shopController = require('../controller/ShopController');
const productController = require('../controller/ProductController');
const feedBackController = require('../controller/FeedBackController');

// Cấu hình multer cho upload shop logo
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

//category
router.get('/category/get_list_category', shopController.getCategory);

//product
router.get('/product', shopController.getAllProduct);
router.post('/product/get_list_product', shopController.getProducts);
router.get('/product/get_feedbacks_by_product/:id', feedBackController.getFeedBacksByProductId);
router.get('/product/get_product_by_id/:id', shopController.getProductById);
router.get('/product/get_product_by_name/:name', shopController.getProductByName);
router.get('/product/get_top_searched_products', productController.getTopSearchedProducts);
router.get('/product/top-products', productController.getTopProducts);
router.get('/product/category/:categoryName', shopController.getProductsByCategory);
// cart
router.get('/cart/get_cart_by_user/:id', shopController.getCartsByUserId);
router.post('/cart/add_to_cart', shopController.createCart);
router.post('/cart/update_quantity/:cartId', shopController.updateCartQuantity);
router.post('/cart/remove_item/:cartId', shopController.removeCartItem);
router.post('/cart/remove_multiple', shopController.removeMultipleCartItems);

router.get('/cart/get_count_cart_by_user/:id', shopController.getCountCartByUserId);

// Shop || Seller
router.get('/get_shop_by_user/:id', shopController.getShopByUserId);
// Thêm middleware multer vào route updateShop
router.post('/:id/update', upload.single('shop_logo'), shopController.updateShop);

router.get('/feedbacks/:id', shopController.getFeedbacksByShop);

// quản lí tất cả sản phẩm
router.get('/all_products/:shopId', shopController.getSellerProducts);
router.post('/product/create', upload.single('product_image'), shopController.createProduct);
router.put('/product/update/:id', shopController.updateProduct);
router.post('/product/delete/:id', shopController.deleteProduct);


// Shop Homepage
router.get('/:id/homepage', shopController.getShopHomepage);

// Shop Products
router.get('/:shopId/products', shopController.getProductsByShopAndCategory);

//shop order
router.get('/order/get_new_order_by_shop/:shopId', shopController.getNewOrderByShop);
router.get('/order/get_processing_order_by_shop/:shopId', shopController.getProcessingOrderByShop);
router.get('/order/get_completed_order_by_shop/:shopId', shopController.getCompletedOrdersByShop);
router.get('/order/get_cancelled_order_by_shop/:shopId', shopController.getCancelledOrdersByShop);
router.get('/order/get_delivery_order_by_shop/:shopId', shopController.getDeliveryOrdersByShop);
router.post('/order/update_order_status/:orderId', shopController.updateStatusOrder);

module.exports = router;
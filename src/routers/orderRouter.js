const orderController = require('../controller/orderController');
const express = require('express');
const router = express.Router();

router.post('/create_order', orderController.createOrder);
router.get('/:id', orderController.getOrdersByUserId);
//Lấy danh sách các đơn hàng đã hoàn thành theo userId
router.get('/completed/:id', orderController.getCompletedOrders);
//Lấy chi tiết của một đơn hàng đã hoàn thành theo orderId
router.get('/completed/order/:id', orderController.getCompletedOrder);

module.exports = router;
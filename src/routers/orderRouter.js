const orderController = require('../controller/orderController');
const express = require('express');
const router = express.Router();

router.post('/create_order', orderController.createOrder);
router.get('/:id', orderController.getOrdersByUserId);

router.get('/cancelled/:id', orderController.getCancelledOrders);
router.put('/cancelled/:id', orderController.cancelOrder);

router.get('/completed/:id', orderController.getCompletedOrders);
router.get('/all_orders/:id', orderController.getAllOrders);

module.exports = router;
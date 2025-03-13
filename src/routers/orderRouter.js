const orderController = require('../controller/orderController');
const express = require('express');
const router = express.Router();

router.post('/create_order', orderController.createOrder);
router.get('/:id', orderController.getOrdersByUserId);
router.get('/completed/:id', orderController.getCompletedOrders);
module.exports = router;
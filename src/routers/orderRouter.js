const orderController = require("../controller/orderController");
const express = require("express");
const router = express.Router();

router.post("/create_order", orderController.createOrder);
router.get("/:id", orderController.getOrdersByUserId);

router.get("/cancelled/:id", orderController.getCancelledOrders);
router.put("/cancelled/:id", orderController.cancelOrder);

router.get("/completed/:id", orderController.getCompletedOrders);
router.get("/all_orders/:id", orderController.getAllOrders);

router.get('/pending/:id', orderController.getPendingPaymentOrders);


router.get("/shop/count/:shopId", orderController.getOrderCountByShopId);
//dashboard
router.get("/shop/order_recent/:shopId", orderController.getRecentOrdersByShop);
router.get('/shop/:shopId/dashboard', orderController.getDashboardStats);
router.get('/shop/:shopId/daily-stats-in-month', orderController.getDailyStatsInMonth);
router.get('/shop/:shopId/revenue-summary', orderController.getRevenueSummary);
module.exports = router;


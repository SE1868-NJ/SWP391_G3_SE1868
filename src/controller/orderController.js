const orderService = require("../services/orderService");
const BaseController = require("./baseController");
const emailService = require("../services/emailService");

class OrderController extends BaseController {
  createOrder = async (req, res) => {
    try {
      const order = req.body;

      const result = await orderService.createOrder(order);
      try {
        await emailService.sendOrderSuccessEmail(order.order_id);
      } catch (emailError) {
        console.error('Gửi email thất bại:', emailError.message);
        // Không cần throw, tránh làm fail cả order
      }
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getOrdersByUserId = async (req, res) => {
    try {
      const userId = req.params.id;

      const result = await orderService.getOrdersByUserId(userId);
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getCompletedOrders = async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await orderService.getCompletedOrders(userId);

      if (!result) {
        return this.convertToJson(res, 404, {
          message: "No completed order found for this user",
        });
      }
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  getCancelledOrders = async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await orderService.getCancelledOrders(userId);
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  getAllOrders = async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await orderService.getAllOrders(userId);
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  cancelOrder = async (req, res) => {
    try {
      const orderId = req.params.id;
      const result = await orderService.cancelOrder(orderId);
      this.convertToJson(res, 200, { message: 'Order cancelled successfully', data: result });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  getPendingPaymentOrders = async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await orderService.getPendingPaymentOrders(userId);
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getOrderCountByShopId = async (req, res) => {
    try {
      const shopId = req.params.shopId;
      const result = await orderService.getOrderCountByShopId(shopId);
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getRecentOrdersByShop = async (req, res) => {
    const shopId = req.params.shopId;
    const limit = parseInt(req.query.limit) || 5;

    try {
      const orders = await orderService.getRecentOrdersByShop(shopId, limit);
      res.status(200).json({ orders });
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng gần đây:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  //dashboard
  getDashboardStats = async (req, res) => {
    try {
      const shopId = req.params.shopId;
      const timeRange = req.query.timeRange || 'today'; // today, week, month, year

      const result = await orderService.getDashboardStats(shopId, timeRange);
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

getDailyStatsInMonth = async (req, res) => {
  try {
    const shopId = req.params.shopId;
    const date = req.query.date || new Date().toISOString().split('T')[0]; 
    const result = await orderService.getDailyStatsInMonth(shopId, date);
    this.convertToJson(res, 200, result);
  } catch (error) {
    this.handleError(res, error);
  }
};

  // Phương thức lấy tổng quan doanh thu và đơn hàng
  getRevenueSummary = async (req, res) => {
    try {
      const shopId = req.params.shopId;
      const period = req.query.period || 'today'; // today, yesterday, week, month

      const result = await orderService.getRevenueSummary(shopId, period);
      this.convertToJson(res, 200, result);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}


module.exports = new OrderController();

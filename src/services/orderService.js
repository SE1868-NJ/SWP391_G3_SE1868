const orderRepository = require("../repositories/OrderRepository");
const OrderRepository = require("../repositories/OrderRepository");

class OrderService {
  constructor() {

  }

  async createOrder(data) {
    return await orderRepository.createOrder(data);
  }

  async getOrdersByUserId(userId, limit, offset) {
    return await orderRepository.getOrdersByUserId(userId, limit, offset);
  }
  async getCompletedOrder(orderId) {
    const order = await orderRepository.getOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Nếu đã hoàn thành, trả về thông tin chi tiết đơn hàng
    if (order.status.toLowerCase() === "completed") {
      return order; // ✅ Trả về thông tin đơn hàng thay vì ném lỗi
    }

    // Nếu chưa hoàn thành, cập nhật trạng thái
    return await orderRepository.updateOrder(orderId, { status: "completed" });
  }
  async getCompletedOrders(userId) {
    try {
      const orders = await orderRepository.getCompletedOrders(userId);
      if (!orders || orders.length === 0) {
        throw new Error("No completed orders found for this user");
      }
      return orders; // Trả về mảng các đơn hàng đã hoàn thành
    } catch (error) {
      console.error("Error fetching completed orders:", error.message);
      throw error;
    }
  }
}

module.exports = new OrderService();
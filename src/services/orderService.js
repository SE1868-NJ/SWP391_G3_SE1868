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
    if (order.status.toLowerCase() === "completed") {
      return order; 
    }
    return await orderRepository.updateOrder(orderId, { status: "completed" });
  }
  async getCompletedOrders(userId) {
    try {
      const order = await orderRepository.getCompletedOrders(userId);
      if (!order) {
        throw new Error("No completed orders found for this user");
      }
      return order;
    } catch (error) {
      console.error("Error fetching completed orders:", error.message);
      throw error;
    }
  }
}

module.exports = new OrderService();
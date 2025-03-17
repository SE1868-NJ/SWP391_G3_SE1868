const orderRepository = require('../repositories/OrderRepository');
const cartRepository = require('../repositories/CartRepository');
const productRepository = require('../repositories/ProductRepository');
const orderDetailRepository = require('../repositories/OrderDetailRepository');

class OrderService {
  constructor() { }

  async createOrder(data) {
    try {
      const ItemProducts = data.items;
      const order = await orderRepository.createOrder(data);

      for (let i = 0; i < ItemProducts.length; i++) {
        //update is_ordered in cart
        await cartRepository.updateIsOrdered(data.user_id, ItemProducts[i].product_id);
        // update stock
        const product = await productRepository.getProductById(ItemProducts[i].product_id);
        if (!product) {
          throw new Error("Product not found");
        }
        product.stock_quantity = product.stock_quantity - ItemProducts[i].quantity;
        await productRepository.updateStockQuantity(product);
        //create order detail
        const orderDetail = {
          order_id: order.order_id,
          product_id: ItemProducts[i].product_id,
          quantity: ItemProducts[i].quantity,
          price: ItemProducts[i].price,
          subtotal: 0
        }
        await orderDetailRepository.createOrderDetail(orderDetail);
      }
      return order;
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  async getOrdersByUserId(userId, limit, offset) {
    return await orderRepository.getOrdersByUserId(userId, limit, offset);
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

  async getCancelledOrders(userId) {
    return await orderRepository.getCancelledOrders(userId);
  }

  async cancelOrder(orderId) {
    const order = await orderRepository.getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status.toLowerCase() === 'cancelled') {
      throw new Error('Order is already cancelled');
    }
    return await orderRepository.updateOrder(orderId, { status: 'cancelled' });
  }

  async getPendingPaymentOrders(userId) {
    return await orderRepository.getOrdersByStatus(userId, 'pending_payment');
}

async updateOrderToPendingPayment(orderId) {
    const order = await orderRepository.getOrderById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    if (order.status !== 'pending') {
        throw new Error('Only pending orders can be moved to pending payment');
    }
    return await orderRepository.updateOrder(orderId, { status: 'pending_payment' });
}

}

module.exports = new OrderService();

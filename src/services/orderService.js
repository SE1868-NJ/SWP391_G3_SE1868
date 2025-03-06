const orderRepository = require('../repositories/OrderRepository');
const orderDetailRepository = require('../repositories/OrderDetailRepository');

class OrderService {
    constructor() {
    }

    async createOrder(data) {
        return await orderRepository.createOrder(data);
    }

    async getOrdersByUserId(userId, limit, offset) {
        return await orderRepository.getOrdersByUserId(userId, limit, offset);
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
}

module.exports = new OrderService();
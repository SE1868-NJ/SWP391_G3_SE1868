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
}

module.exports = new OrderService();
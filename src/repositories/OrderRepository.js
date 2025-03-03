const db = require('../models');

class OrderRepository {
    constructor() {
    }

    async getOrdersByUserId(userId, limit, offset) {
        return await db.Order.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    }

    async countOrdersByUserId(userId) {
        return await db.Order.count({
            where: { user_id: userId }
        });
    }

    async getOrderById(orderId) {
        return await db.Order.findOne({
            where: { order_id: orderId }
        });
    }

    async createOrder(data) {
        return await db.Order.create(data);
    }

    async updateOrder(orderId, data) {
        return await db.Order.update(data, {
            where: { order_id: orderId }
        });
    }
}

module.exports = new OrderRepository();
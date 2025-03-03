const db = require('../models');

class OrderDetailRepository {
    constructor() {
    }

    async getOrderDetailsByOrderId(orderId) {
        return await db.OrderDetail.findAll({
            where: { order_id: orderId }
        });
    }

    async createOrderDetail(data) {
        return await db.OrderDetail.create(data);
    }
}

module.exports = new OrderDetailRepository();
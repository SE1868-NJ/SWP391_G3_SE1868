const db = require('../models');

class OrderDetailRepository {
    constructor() {
    }

    async getOrderDetailsByOrderId(orderId) {
        try {
            const orderDetails = await db.OrderDetail.findAll({
                where: { order_id: orderId },
                include: [
                    {
                        model: db.Product, 
                        attributes: ['product_name', 'image_url', 'product_description'],  
                    }
                ],
                attributes: ['id', 'order_id', 'product_id', 'price', 'quantity', 'subtotal', 'created_at', 'updated_at']  
            });
    
            return orderDetails;
        } catch (error) {
            console.error("Error fetching order details:", error);
            throw error;
        }
    }
    

    async createOrderDetail(data) {
        return await db.OrderDetail.create(data);
    }
}

module.exports = new OrderDetailRepository();
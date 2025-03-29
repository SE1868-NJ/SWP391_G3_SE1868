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
                        attributes: ['product_name', 'image_url', 'import_price', 'sale_price', 'product_description'],
                        include: [{
                            model: db.Category,
                            attributes: ['name'],
                            as: 'category'
                        },
                        {
                            model: db.Shop,
                            attributes: ['shop_name', 'shop_id'],
                            as: 'shop'
                        }
                        ]
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
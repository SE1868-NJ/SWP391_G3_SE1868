const orderRepository = require('../repositories/OrderRepository');
const cartRepository = require('../repositories/CartRepository');
const orderDetailRepository = require('../repositories/OrderDetailRepository');

class OrderService {
    constructor() {
    }

    async createOrder(data) {
        const ItemProducts = data.items;
        // update status cart order
        for (let i = 0; i < ItemProducts.length; i++) {
            const dataUpdate = await cartRepository.updateIsOrdered(data.user_id, ItemProducts[i].product_id);
            console.log(dataUpdate);
        }

        // create order
        return await orderRepository.createOrder(data);
    }

    async getOrdersByUserId(userId, limit, offset) {
        return await orderRepository.getOrdersByUserId(userId, limit, offset);
    }
}

module.exports = new OrderService();
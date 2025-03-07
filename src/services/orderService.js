const orderRepository = require('../repositories/OrderRepository');
const cartRepository = require('../repositories/CartRepository');
const productRepository = require('../repositories/ProductRepository');
const orderDetailRepository = require('../repositories/OrderDetailRepository');

class OrderService {
    constructor() {
    }

    async createOrder(data) {
        try {
            const ItemProducts = data.items;
            //console.log(ItemProducts);
            for (let i = 0; i < ItemProducts.length; i++) {
                //update is_ordered in cart
                const dataUpdate = await cartRepository.updateIsOrdered(data.user_id, ItemProducts[i].product_id);
                //update stock_quantity in product
                const product = await productRepository.getProductById(ItemProducts[i].product_id);
                if (!product) {
                    throw new Error("Product not found");
                }
                product.stock_quantity = product.stock_quantity - ItemProducts[i].quantity;
                await productRepository.updateStockQuantity(product);
            }
            return await orderRepository.createOrder(data);
        } catch (error) {
            throw new Error(`Error creating order: ${error.message}`);
        }
    }

    async getOrdersByUserId(userId, limit, offset) {
        return await orderRepository.getOrdersByUserId(userId, limit, offset);
    }
}

module.exports = new OrderService();
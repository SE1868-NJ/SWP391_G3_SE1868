const orderRepository = require("../repositories/OrderRepository");
const cartRepository = require("../repositories/CartRepository");
const productRepository = require("../repositories/ProductRepository");
const orderDetailRepository = require("../repositories/OrderDetailRepository");
const userRepository = require("../repositories/UserRepository");
const c = require("config");

class OrderService {
	constructor() { }

	async createOrder(data) {
		try {
			const ItemProducts = data.items;
			const orders = [];

			const groupedByShop = ItemProducts.reduce((acc, item) => {
				if (!acc[item.shop_id]) {
					acc[item.shop_id] = [];
				}
				acc[item.shop_id].push(item);
				return acc;
			}, {});

			for (let shopId in groupedByShop) {
				const shopItems = groupedByShop[shopId];

				const orderData = {
					user_id: data.user_id,
					address_id: data.address_id,
					total: shopItems.reduce((total, item) => total + (item.price * item.quantity), 0),
					note: data.note,
					payment_method: data.payment_method,
					voucher_id: data.voucher_id,
					shop_id: shopId,
				};

				const order = await orderRepository.createOrder(orderData);
				orders.push(order);

				for (let i = 0; i < shopItems.length; i++) {
					await cartRepository.updateIsOrdered(data.user_id, shopItems[i].product_id);

					const product = await productRepository.getProductById(shopItems[i].product_id);
					if (!product) {
						throw new Error("Product not found");
					}
					product.stock_quantity = product.stock_quantity - shopItems[i].quantity;
					await productRepository.updateStockQuantity(product);

					const orderDetail = {
						order_id: order.order_id,
						product_id: shopItems[i].product_id,
						quantity: shopItems[i].quantity,
						price: shopItems[i].price,
						subtotal: shopItems[i].price * shopItems[i].quantity,
					};
					await orderDetailRepository.createOrderDetail(orderDetail);
				}
			}

			// Trả về tất cả các đơn hàng đã tạo
			return orders;
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
		return await orderRepository.getPendingPaymentOrders(userId, 'pending');
	}

	async getAllOrders(userId) {
		try {
			const order = await orderRepository.getAllOrders(userId);
			if (!order) {
				throw new Error("No orders found for this user");
			}
			return order;
		} catch (error) {
			throw error;
		}
	}

	async getNewOrderByShop(shopId) {
		try {
			const orders = await orderRepository.getAllNewOrderByShop(shopId);

			if (!orders) {
				throw new Error("No new orders found for this shop");
			}
			for (let order of orders) {
				const user = await userRepository.getUserById(order.user_id);
				order.dataValues.full_name = user?.dataValues.name
				order.dataValues.phone = user?.dataValues.phone
			}

			return orders;
		}
		catch (error) {
			throw error;
		}
	}

	async getProcessingOrderByShop(shopId) {
		try {
			const orders = await orderRepository.getAllProcessingOrderByShop(shopId);

			if (!orders) {
				throw new Error("No processing orders found for this shop");
			}
			for (let order of orders) {
				const user = await userRepository.getUserById(order.user_id);
				order.dataValues.full_name = user?.dataValues.name
				order.dataValues.phone = user?.dataValues.phone
			}

			return orders;
		}
		catch (error) {
			throw error;
		}
	}

	async getDeliveryOrderByShop(shopId) {
		try {
			const orders = await orderRepository.getAllDeliveryOrderByShop(shopId);

			if (!orders) {
				throw new Error("No delivery orders found for this shop");
			}
			for (let order of orders) {
				const user = await userRepository.getUserById(order.user_id);
				order.dataValues.full_name = user?.dataValues.name
				order.dataValues.phone = user?.dataValues.phone
			}

			return orders;
		}
		catch (error) {
			throw error;
		}
	}

	async getCompletedOrdersByShop(shopId) {
		try {
			const orders = await orderRepository.getAllCompletedOrderByShop(shopId);

			if (!orders) {
				throw new Error("No completed orders found for this shop");
			}
			for (let order of orders) {
				const user = await userRepository.getUserById(order.user_id);
				order.dataValues.full_name = user?.dataValues.name
				order.dataValues.phone = user?.dataValues.phone
			}

			return orders;
		}
		catch (error) {
			throw error;
		}
	}

	async getCancelledOrdersByShop(orderId) {
		try {
			const orders = await orderRepository.getAllCancelledOrderByShop(orderId);

			if (!orders) {
				throw new Error("No cancelled orders found for this shop");
			}
			for (let order of orders) {
				const user = await userRepository.getUserById(order.user_id);
				order.dataValues.full_name = user?.dataValues.name
				order.dataValues.phone = user?.dataValues.phone
			}

			return orders;
		}
		catch (error) {
			throw error;
		}
	}

	async updateOrderStatus(orderId, status) {
		const order = await orderRepository.getOrderById(orderId);
		if (!order) {
			throw new Error('Order not found');
		}
		return await orderRepository.updateOrder(orderId, { status });
	}

	async getOrders() {
		try {
			const orders = await orderRepository.getOrders();
			return orders;
		} catch (error) {
			throw new Error(`Error getting orders: ${error.message}`);
		}
	}
}

module.exports = new OrderService();

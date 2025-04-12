const orderRepository = require("../repositories/OrderRepository");
const cartRepository = require("../repositories/CartRepository");
const productRepository = require("../repositories/ProductRepository");
const orderDetailRepository = require("../repositories/OrderDetailRepository");
const userRepository = require("../repositories/UserRepository");
const addressRepository = require("../repositories/AddressRepository");

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
			console.log(1);

			for (let shopId in groupedByShop) {
				const shopItems = groupedByShop[shopId];

				const orderData = {
					order_id: data.order_id,
					user_id: data.user_id,
					address_id: data.address_id,
					total: shopItems.reduce((total, item) => total + (item.price * item.quantity), 0),
					note: data.note,
					payment_method: data.payment_method,
					voucher_id: data.voucher_id,
					shop_id: shopId,
				};
				console.log(orderData);

				const order = await orderRepository.createOrder(orderData);
				console.log(3);
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
					console.log(2);
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
			const orders = await orderRepository.getCompletedOrders(userId);
			if (!orders) {
				throw new Error("No completed orders found for this user");
			}
			for (let order of orders) {
				const orderDetails = await orderDetailRepository.getOrderDetailsByOrderId(order.order_id);
				order.dataValues.orderDetails = orderDetails;
			}
			return orders;
		} catch (error) {
			throw error;
		}
	}

	async getCancelledOrders(userId) {
		try {
			const orders = await orderRepository.getCancelledOrders(userId);
			if (!orders) {
				throw new Error("No cancelled orders found for this user");
			}
			for (let order of orders) {
				const orderDetails = await orderDetailRepository.getOrderDetailsByOrderId(order.order_id);
				order.dataValues.orderDetails = orderDetails;
			}
			return orders;
		} catch (error) {
			throw error;
		}
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
		try {
			const orders = await orderRepository.getPendingPaymentOrders(userId);
			if (!orders) {
				throw new Error("No pending payment orders found for this user");
			}
			for (let order of orders) {
				const orderDetails = await orderDetailRepository.getOrderDetailsByOrderId(order.order_id);
				order.dataValues.orderDetails = orderDetails;
			}
			return orders;
		} catch (error) {
			throw error;
		}
	}

	async getAllOrders(userId) {
		try {
			const orders = await orderRepository.getAllOrders(userId);
			if (!orders) {
				throw new Error("No orders found for this user");
			}
			for (let order of orders) {
				const orderDetails = await orderDetailRepository.getOrderDetailsByOrderId(order.order_id);
				order.dataValues.orderDetails = orderDetails;
			}
			return orders;
		} catch (error) {
			throw error;
		}
	}


	async getOrderCountByShopId(shopId) {
		try {
			const count = await orderRepository.countOrdersByShopId(shopId);
			return { count };
		} catch (error) {
			console.error("Lỗi khi đếm đơn hàng của shop:", error.message);
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

				const orderDetails = await orderDetailRepository.getOrderDetailsByOrderId(order.order_id);
				order.dataValues.OrderDetails = orderDetails;

				const address = await addressRepository.getAddressById(order.address_id);
				order.dataValues.Address = address;
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

				const orderDetails = await orderDetailRepository.getOrderDetailsByOrderId(order.order_id);
				order.dataValues.OrderDetails = orderDetails;

				const address = await addressRepository.getAddressById(order.address_id);
				order.dataValues.Address = address;
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

				const orderDetails = await orderDetailRepository.getOrderDetailsByOrderId(order.order_id);
				order.dataValues.OrderDetails = orderDetails;

				const address = await addressRepository.getAddressById(order.address_id);
				order.dataValues.Address = address;
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

				const orderDetails = await orderDetailRepository.getOrderDetailsByOrderId(order.order_id);
				order.dataValues.OrderDetails = orderDetails;

				const address = await addressRepository.getAddressById(order.address_id);
				order.dataValues.Address = address;
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

				const orderDetails = await orderDetailRepository.getOrderDetailsByOrderId(order.order_id);
				order.dataValues.OrderDetails = orderDetails;

				const address = await addressRepository.getAddressById(order.address_id);
				order.dataValues.Address = address
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

	async getOrderById(orderId) {
		try {
			const orders = await orderRepository.getOrderById(orderId);
			if (!orders) {
				throw new Error("Order not found");
			}
			return orders;
		} catch (error) {
			throw new Error(`Error getting order: ${error.message}`);
		}
	}

	async updatePaymentStatusByOrderId(orderId, paymentStatus) {
		return await orderRepository.updatePaymentStatusByOrderId(orderId, paymentStatus);
	}

	async getRecentOrdersByShop(shopId, limit) {
		const orders = await orderRepository.getRecentOrdersByShop(shopId, limit);

		return orders.map(order => ({
			orderCode: `ORD-${order.id}`,
			customerName: order.User.full_name,
			totalAmount: order.total,
			status: order.status
		}));
	}

//dashboard
async getDashboardStats(shopId, timeRange) {
    try {
      let startDate, endDate = new Date();
      
      switch(timeRange) {
        case 'today':
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate = new Date();
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
      }
      
      const stats = await orderRepository.getDashboardStats(shopId, startDate, endDate);

      return {
        totalRevenue: stats.totalRevenue || 0,
        totalOrders: stats.totalOrders || 0,
        averageOrderValue: stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0,
        orderStatusCounts: stats.orderStatusCounts || {}
      };
    } catch (error) {
      throw new Error(`Error getting dashboard stats: ${error.message}`);
    }
  }

  async getDailyStatsInMonth(shopId, dateStr) {
	try {
	  const date = new Date(dateStr);
	  const year = date.getFullYear();
	  const month = date.getMonth();
	  
	  // Tìm số ngày trong tháng
	  const daysInMonth = new Date(year, month + 1, 0).getDate();
	  
	  // Lấy dữ liệu theo ngày từ database
	  const dailyData = await orderRepository.getDailyStatsInMonth(shopId, date);
	  
	  // Tạo mảng chứa dữ liệu cho tất cả các ngày trong tháng
	  const result = Array(daysInMonth).fill().map((_, index) => {
		const day = index + 1;
		const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		
		return {
		  date: formattedDate,
		  revenue: 0,
		  orders: 0
		};
	  });
	  
	  // Điền dữ liệu vào các ngày tương ứng
	  dailyData.forEach(item => {
		const day = new Date(item.orderDate).getDate() - 1; // Chuyển về index 0-based
		result[day].revenue = parseFloat(item.revenue);
		result[day].orders = parseInt(item.orderCount);
	  });
	  
	  return result;
	} catch (error) {
	  throw new Error(`Error getting daily stats in month: ${error.message}`);
	}
  }
  

  async getRevenueSummary(shopId, period) {
    try {
      let startDate, endDate = new Date();
      
      switch(period) {
        case 'today':
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'yesterday':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'week':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
      }
      
      const summary = await orderRepository.getRevenueSummary(shopId, startDate, endDate);
      
      return {
        period,
        revenue: summary.totalRevenue || 0,
        orderCount: summary.totalOrders || 0,
        completedOrders: summary.completedOrders || 0,
        cancelledOrders: summary.cancelledOrders || 0,
        pendingOrders: summary.pendingOrders || 0
      };
    } catch (error) {
      throw new Error(`Error getting revenue summary: ${error.message}`);
    }
  }
}

module.exports = new OrderService();

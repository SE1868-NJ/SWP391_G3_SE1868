const db = require("../models");

class OrderRepository {
  constructor() { }

  async getOrdersByUserId(userId, limit, offset) {
    return await db.Order.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  }

  async countOrdersByUserId(userId) {
    return await db.Order.count({
      where: { user_id: userId },
    });
  }

  async getOrderById(orderId) {
    return await db.Order.findAll({
      where: { id: orderId },
    });
  }

  async createOrder(data) {
    return await db.Order.create(data);
  }

  async updateOrder(orderId, data) {
    return await db.Order.update(data, {
      where: { order_id: orderId },
    });
  }
  async getCancelledOrders(userId) {
    return await db.Order.findAll({
      where: {
        user_id: userId,
        status: "cancelled",
      },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: db.OrderDetail,
          required: false,
          attributes: ["id", "product_id", "price", "quantity", "subtotal"],
          include: [
            {
              model: db.Product,
              attributes: [
                "product_name",
                "image_url",
                "import_price",
                "sale_price",
              ],
              include: [
                {
                  model: db.Category,
                  attributes: ["name"],
                  as: "category",
                },
                {
                  model: db.Shop,
                  attributes: ["shop_name", "shop_id"],
                  as: "shop",
                },
              ],
            },
          ],
        },
      ],
    });
  }
  async getCompletedOrders(userId) {
    return await db.Order.findAll({
      where: {
        user_id: userId,
        status: "COMPLETED",
      },
      order: [["created_at", "DESC"]],
    });
  }

  async getPendingPaymentOrders(userId) {
    return await db.Order.findAll({
      where: {
        user_id: userId,
        status: 'PENDING'
      },
      order: [['created_at', 'DESC']],
    }
    );
  }

  async getAllOrders(userId) {
    return await db.Order.findAll({
      where: {
        user_id: userId,
      },
      order: [["created_at", "DESC"]],
    });
  }

  async getOrders() {
    return await db.Order.findAll();
  }

  async getAllNewOrderByShop(shopId) {
    return await db.Order.findAll({
      where: {
        shop_id: shopId,
        status: 'pending'
      },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: db.OrderDetail,
          required: false,
          attributes: ['id', 'product_id', 'price', 'quantity', 'subtotal'],
          include: [
            {
              model: db.Product,
              attributes: ['product_name', 'image_url', 'import_price', 'sale_price'],
            }
          ]
        }
      ]
    });
  }

  async getAllDeliveryOrderByShop(shopId) {
    return await db.Order.findAll({
      where: {
        shop_id: shopId,
        status: 'DELIVERY'
      },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: db.OrderDetail,
          required: false,
          attributes: ['id', 'product_id', 'price', 'quantity', 'subtotal'],
          include: [
            {
              model: db.Product,
              attributes: ['product_name', 'image_url', 'import_price', 'sale_price'],
            }
          ]
        }
      ]
    });
  }

  async getAllProcessingOrderByShop(shopId) {
    return await db.Order.findAll({
      where: {
        shop_id: shopId,
        status: 'PROCESSING'
      },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: db.OrderDetail,
          required: false,
          attributes: ['id', 'product_id', 'price', 'quantity', 'subtotal'],
          include: [
            {
              model: db.Product,
              attributes: ['product_name', 'image_url', 'import_price', 'sale_price'],
            }
          ]
        }
      ]
    });
  }

  async getAllCompletedOrderByShop(shopId) {
    return await db.Order.findAll({
      where: {
        shop_id: shopId,
        status: 'COMPLETED'
      },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: db.OrderDetail,
          required: false,
          attributes: ['id', 'product_id', 'price', 'quantity', 'subtotal'],
          include: [
            {
              model: db.Product,
              attributes: ['product_name', 'image_url', 'import_price', 'sale_price'],
            }
          ]
        }
      ]
    });
  }

  async getAllCancelledOrderByShop(shopId) {
    return await db.Order.findAll({
      where: {
        shop_id: shopId,
        status: 'CANCELLED'
      },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: db.OrderDetail,
          required: false,
          attributes: ['id', 'product_id', 'price', 'quantity', 'subtotal'],
          include: [
            {
              model: db.Product,
              attributes: ['product_name', 'image_url', 'import_price', 'sale_price'],
            }
          ]
        }
      ]
    });
  }

  async updateStatusOrder(orderId, status) {
    return await db.Order.update({ status: status }, {
      where: {
        order_id: orderId
      }
    });
  }

  async updatePaymentStatusByOrderId(orderId, paymentStatus) {
    return await db.Order.update({ payment_status: paymentStatus }, {
      where: {
        order_id: orderId
      }
    });
  }

  async countOrdersByShopId(shopId) {
    return await db.Order.count({
      where: { shop_id: shopId }
    });
  }

  //don hang theo shop gan day

  async getRecentOrdersByShop(shopId, limit = 5) {
    const orders = await db.Order.findAll({
      subQuery: false, // 💡 Tránh lỗi alias sai khi join
      where: { shop_id: shopId },
      include: [
        {
          model: db.OrderDetail,
          required: true,
          include: [
            {
              model: db.Product,
              required: true,
            }
          ]
        },
        {
          model: db.User,
          attributes: ['full_name'],
          required: true
        }
      ],
      order: [['created_at', 'DESC']],
      limit
    });

    return orders;
  }

//dashboard

async getDashboardStats(shopId, startDate, endDate) {
  // Lấy tổng doanh thu
  const revenueResult = await db.Order.findOne({
    attributes: [
      [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalRevenue']
    ],
    where: {
      shop_id: shopId,
      status: 'COMPLETED',
      created_at: {
        [db.Sequelize.Op.between]: [startDate, endDate]
      }
    }
  });

  // Lấy tổng số đơn hàng
  const totalOrders = await db.Order.count({
    where: {
      shop_id: shopId,
      created_at: {
        [db.Sequelize.Op.between]: [startDate, endDate]
      }
    }
  });

  // Lấy số lượng đơn hàng theo trạng thái
  const orderStatusCounts = await db.Order.findAll({
    attributes: [
      'status',
      [db.sequelize.fn('COUNT', db.sequelize.col('order_id')), 'count']
    ],
    where: {
      shop_id: shopId,
      created_at: {
        [db.Sequelize.Op.between]: [startDate, endDate]
      }
    },
    group: ['status']
  });

  // Chuyển đổi kết quả thành đối tượng
  const orderStatusMap = {};
  orderStatusCounts.forEach(status => {
    orderStatusMap[status.status.toLowerCase()] = parseInt(status.getDataValue('count'));
  });

  return {
    totalRevenue: parseFloat(revenueResult.getDataValue('totalRevenue') || 0),
    totalOrders,
    orderStatusCounts: orderStatusMap
  };
}
async getDailyStatsInMonth(shopId, monthDate) {
  const date = new Date(monthDate);
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  
  const startDate = new Date(year, month, 1, 0, 0, 0, 0);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return await db.sequelize.query(`
    SELECT 
      DATE(created_at) as orderDate,
      SUM(total) as revenue,
      COUNT(order_id) as orderCount
    FROM orders
    WHERE 
      shop_id = :shopId
      AND created_at BETWEEN :startDate AND :endDate
      AND status != 'cancelled'
    GROUP BY DATE(created_at)
    ORDER BY orderDate ASC
  `, {
    replacements: { shopId, startDate, endDate },
    type: db.sequelize.QueryTypes.SELECT
  });
}


async getRevenueSummary(shopId, startDate, endDate) {
  // Lấy tổng doanh thu và số lượng đơn hàng
  const revenueSummary = await db.Order.findOne({
    attributes: [
      [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalRevenue'],
      [db.sequelize.fn('COUNT', db.sequelize.col('order_id')), 'totalOrders']
    ],
    where: {
      shop_id: shopId,
      created_at: {
        [db.Sequelize.Op.between]: [startDate, endDate]
      }
    }
  });

  // Lấy số đơn hàng đã hoàn thành
  const completedOrders = await db.Order.count({
    where: {
      shop_id: shopId,
      status: 'COMPLETED',
      created_at: {
        [db.Sequelize.Op.between]: [startDate, endDate]
      }
    }
  });

  // Lấy số đơn hàng đã hủy
  const cancelledOrders = await db.Order.count({
    where: {
      shop_id: shopId,
      status: 'CANCELLED',
      created_at: {
        [db.Sequelize.Op.between]: [startDate, endDate]
      }
    }
  });

  // Lấy số đơn hàng đang chờ xử lý
  const pendingOrders = await db.Order.count({
    where: {
      shop_id: shopId,
      status: 'PENDING',
      created_at: {
        [db.Sequelize.Op.between]: [startDate, endDate]
      }
    }
  });

  return {
    totalRevenue: parseFloat(revenueSummary.getDataValue('totalRevenue') || 0),
    totalOrders: parseInt(revenueSummary.getDataValue('totalOrders') || 0),
    completedOrders,
    cancelledOrders,
    pendingOrders
  };
}
}
module.exports = new OrderRepository();

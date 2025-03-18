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
    return await db.Order.findOne({
      where: { order_id: orderId },
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

  async getPendingPaymentOrders(userId) {
    return await db.Order.findAll({
      where: {
        user_id: userId,
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
              include: [
                {
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
          ]
        }
      ]
    }
    );
  }

  async getAllOrders(userId) {
    return await db.Order.findAll({
      where: {
        user_id: userId,
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
}
module.exports = new OrderRepository();

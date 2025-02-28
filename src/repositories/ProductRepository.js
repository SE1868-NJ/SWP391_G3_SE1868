const db = require("../models");
const { Product } = require("../models");

// const updateSearchCount = async (productId) => {
//     return await Product.increment('search_count', { where: { id: productId } });
// };

// module.exports = {
//     updateSearchCount,
// };

class ProductRepository {
  constructor() {}

  async getAllProduct() {
    return await db.Product.findAll();
  }

  async getProducts(params) {
    const { page = 1, limit = 4, search, sortPrice } = params;

    const whereClause = {
      status: "active",
    };

    if (search && search.trim() !== "") {
      whereClause.product_name = { [db.Sequelize.Op.like]: `%${search}%` };
    }

    const order = [];
    if (sortPrice) {
      order.push(["sale_price", sortPrice === "desc" ? "DESC" : "ASC"]);
    } else {
      order.push(["createdAt", "DESC"]);
    }

    const { count, rows } = await db.Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Category,
          as: "category",
        },
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: order,
    });

    return {
      items: rows,
      metadata: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getProductById(id) {
    return await db.Product.findByPk(id, {
      include: [
        {
          model: db.Shop,
          as: "shop",
        },
      ],
    });
  }

  async getProductByName(productName) {
    return await db.Product.findOne({
      where: {
        product_name: productName,
      },
    });
  }

  // async getMostSearchedProducts(limit = 5) {
  //   return await db.Product.findAll({
  //     order: [["search_count", "DESC"]],
  //     limit: parseInt(limit),
  //   });
  // }
}

module.exports = new ProductRepository();

const db = require('../models');

class ProductRepository {
  constructor() {
  }

  async getAllProduct() {
    return await db.Product.findAll();
  }

  async getProducts(params) {
    const { page = 1, limit = 4, search, sortPrice, categories = [], minPrice, maxPrice } = params;

    const whereClause = {
      status: 'active'
    };

    if (search && search.trim() !== "") {
      whereClause.product_name = { [db.Sequelize.Op.like]: `%${search}%` };
    }

    // Lọc theo khoảng giá
    if (minPrice && maxPrice) {
      whereClause.sale_price = { [db.Sequelize.Op.between]: [minPrice, maxPrice] };
    } else if (minPrice) {
      whereClause.sale_price = { [db.Sequelize.Op.gte]: minPrice };
    } else if (maxPrice) {
      whereClause.sale_price = { [db.Sequelize.Op.lte]: maxPrice };
    }

    // Lọc theo danh mục
    if (categories.length > 0) {
      whereClause['$category.category_name$'] = { [db.Sequelize.Op.in]: categories };
    }

    const order = [];
    if (sortPrice) {
      order.push(["sale_price", sortPrice === "desc" ? "DESC" : "ASC"]);
    } else {
      order.push(["createdAt", "DESC"]);
    }

    const { count, rows } = await db.Product.findAndCountAll({
      where: whereClause,
      include: [{
        model: db.Category,
        as: 'category'
      }],
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
        totalPages: Math.ceil(count / limit)
      }
    };
  }


  async getProductById(id) {
    return await db.Product.findByPk(id, {
      include: [{
        model: db.Shop,
        as: 'shop'
      }]
    });
  }
  async updateSearchCount(productId) {
    try {
      // Sửa lỗi: Thay thế Product bằng db.Product
      const product = await db.Product.findByPk(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      // Cập nhật search_count một cách rõ ràng với giá trị cụ thể
      product.search_count = product.search_count + 1;
      await product.save();

      return product;
    } catch (error) {
      throw new Error(`Error updating search count: ${error.message}`);
    }
  }

  async getMostSearchedProducts(limit = 4) {
    try {
      // Sửa lỗi: Thay thế Product bằng db.Product
      return await db.Product.findAll({
        where: {
          status: "active", // Thêm điều kiện nếu cần
        },
        order: [["search_count", "DESC"]],
        limit: parseInt(limit),
        attributes: [
          "id",
          "product_name",
          "search_count",
          "image_url",
          "sale_price",
        ],
      });
    } catch (error) {
      throw new Error(`Error getting most searched products: ${error.message}`);
    }
  }

  async updateStockQuantity(product) {
    return await db.Product.update(
      { stock_quantity: product.stock_quantity },
      {
        where: { id: product.id },
      }
    );
  }

  async countShopProducts(shopId) {
    return await db.Product.count({ where: { shop_id: shopId } });
  }

  async getProductsByShopAndCategory(shopId, categoryId, sort = 'newest') {
    const whereClause = { shop_id: shopId };
    if (categoryId) whereClause.category_id = categoryId;

    let order = [['id', 'DESC']];

    switch (sort) {
      case 'newest':
        order = [['createdAt', 'DESC']];
        break;
      case 'price_asc':
        order = [['sale_price', 'ASC']];
        break;
      case 'price_desc':
        order = [['sale_price', 'DESC']];
        break;
    }
    return await db.Product.findAll({
      where: whereClause,
      include: [
        { model: db.Category, as: 'category' }
      ],
      order
    });
  }
}

module.exports = new ProductRepository();
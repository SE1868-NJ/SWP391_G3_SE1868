const db = require('../models');

class ProductRepository {
  constructor() { }

  async getAllProduct() {
    return await db.Product.findAll();
  }

  async getProductById(id) {
    return await db.Product.findByPk(id, {
      include: [{
        model: db.Shop,
        as: 'shop'
      }]
    });
  }

  async getProductsByShopAndCategory(params) {
    const {
      shopId,
      categoryId,
      page = 1,
      limit = 12,
      sort = 'newest'
    } = params;

    const whereClause = { shop_id: shopId };
    if (categoryId) whereClause.category_id = categoryId;

    let order = [['id', 'DESC']];  // Mặc định sắp xếp theo ID giảm dần

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

    const { count, rows } = await db.Product.findAndCountAll({
      where: whereClause,
      include: [
        { model: db.Category, as: 'category' }
      ],
      order,
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });

    // Thêm một số thông tin giả để hiển thị UI
    const productsWithDetails = rows.map(product => {
      // Tính phần trăm giảm giá nếu có import_price
      let discountPercent = 0;
      if (product.import_price && product.import_price > product.sale_price) {
        discountPercent = Math.round(((product.import_price - product.sale_price) / product.import_price) * 100);
      }

      return {
        ...product.toJSON(),
        average_rating: Math.random() * 1.5 + 3.5,  // Random từ 3.5-5.0
        sold_count: Math.floor(Math.random() * 100000),  // Random số lượng đã bán
        discount_percent: discountPercent
      };
    });

    return {
      products: productsWithDetails,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  }
}

module.exports = new ProductRepository();
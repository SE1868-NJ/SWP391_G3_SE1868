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
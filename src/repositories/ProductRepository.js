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
      const product = await db.Product.findByPk(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      product.search_count = product.search_count + 1;
      await product.save();
      return product;
    } catch (error) {
      throw new Error(`Error updating search count: ${error.message}`);
    }
  }

  async getMostSearchedProducts(limit) {
    try {
      return await db.Product.findAll({
        where: {
          status: "active",
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

  async getTopProductsByQuantity(limit = 5) {
    try {
      return await db.OrderDetail.findAll({
        attributes: [
          'product_id',
          [db.Sequelize.fn('SUM', db.Sequelize.col('quantity')), 'total_quantity'],
          [db.Sequelize.fn('SUM', db.Sequelize.literal('price * quantity')), 'revenue'],
        ],
        include: [{
          model: db.Product,
          attributes: ['id', 'product_name'],
        }],
        group: ['product_id'],
        order: [[db.Sequelize.fn('SUM', db.Sequelize.col('quantity')), 'DESC']],
        limit: parseInt(limit),
      });
    } catch (error) {
      throw error;
    }
  }

  async getTopProductsByRevenue(limit = 5) {
    try {
      return await db.OrderDetail.findAll({
        attributes: [
          'product_id',
          [db.Sequelize.fn('SUM', db.Sequelize.literal('price * quantity')), 'revenue'],
        ],
        include: [{
          model: db.Product,
          attributes: ['id', 'product_name'],
        }],
        group: ['product_id'],
        order: [[db.Sequelize.fn('SUM', db.Sequelize.literal('price * quantity')), 'DESC']],
        limit: parseInt(limit),
      });
    } catch (error) {
      throw error;
    }
  }

  async getProductSoldCount(productId) {
    try {
      const result = await db.sequelize.query(`
      SELECT 
        COALESCE(SUM(od.quantity), 0) as sold_count
      FROM order_details od
      JOIN orders o ON od.order_id = o.order_id
      WHERE od.product_id = :productId
      AND o.status IN ('COMPLETED', 'DELIVERED', 'processing')
    `, {
        replacements: { productId },
        type: db.sequelize.QueryTypes.SELECT
      });

      return parseInt(result[0]?.sold_count || 0);
    } catch (error) {
      throw new Error(`Error getting product sold count: ${error.message}`);
    }
  }
  async getProductsByCategory(categoryName) {
    try {
      return await db.Product.findAll({
        where: {
          status: 'active'
        },
        include: [{
          model: db.Category,
          as: 'category',
          where: {
            category_name: categoryName
          }
        }]
      });
    } catch (error) {
      throw new Error(`Error getting products by category: ${error.message}`);
    }
  }
  
  async checkForeignKeys({ supplier_id, category_id, shop_id }) {
    const [supplier, category, shop] = await Promise.all([
      db.Supplier.findByPk(supplier_id),
      db.Category.findByPk(category_id),
      db.Shop.findByPk(shop_id),
    ]);

    return {
      supplierExists: !!supplier,
      categoryExists: !!category,
      shopExists: !!shop,
    };
  }

  async getProductDetail(productId) {
    return await db.Product.findByPk(productId, {
      include: [
        { model: db.Category, as: 'category' }
      ]
    });
  }

  async createProduct(productData) {
    return await db.Product.create(productData);
  }

  async updateProduct(productId, productData) {
    return await db.Product.update(productData, {
      where: { id: productId }
    });
  }

  async hideProduct(id) {
    const product = await db.Product.findByPk(id);
  
    if (!product) return false;
    if (product.status === 'inactive') return false;
  
    await db.Product.update(
      { status: 'inactive' },
      { where: { id: id } }
    );
  
    return true;
  }
  
}

module.exports = new ProductRepository();
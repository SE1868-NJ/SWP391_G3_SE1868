const db = require('../models');

class ShopFollowerRepository {
  async findByUserAndShop(user_id, shop_id) {
    return db.ShopFollower.findOne({ where: { user_id, shop_id } });
  }

  async create(user_id, shop_id) {
    return db.ShopFollower.create({ user_id, shop_id });
  }

  async delete(user_id, shop_id) {
    return db.ShopFollower.destroy({ where: { user_id, shop_id } });
  }

  async findOrCreate(user_id, shop_id) {
    return db.ShopFollower.findOrCreate({ where: { user_id, shop_id } });
  }

  async countFollowersByShop(shop_id) {
    return db.ShopFollowers.count({ where: { shop_id } });
  }

  async getFollowersByShopId(shopId) {
    const query = `
      SELECT u.user_id, u.full_name, u.email, u.avatar, u.phone
      FROM shop_followers sf
      JOIN users u ON sf.user_id = u.user_id
      WHERE sf.shop_id = ?
    `;
    return db.sequelize.query(query, {
      replacements: [shopId],
      type: db.Sequelize.QueryTypes.SELECT,
    });
  }
  
}

module.exports = new ShopFollowerRepository();

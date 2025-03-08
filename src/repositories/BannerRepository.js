const db = require('../models');
const { Op } = require('sequelize');

class BannerRepository {
  constructor() { }

  async getActiveShopBanners(shopId) {
    const currentDate = new Date();
    return await db.Banner.findAll({
      where: {
        shop_id: shopId,
        is_active: true,
        [Op.and]: [
          {
            [Op.or]: [
              { start_date: null },
              { start_date: { [Op.lte]: currentDate } }
            ]
          },
          {
            [Op.or]: [
              { end_date: null },
              { end_date: { [Op.gte]: currentDate } }
            ]
          }
        ]
      },
      order: [['id', 'DESC']]
    });
  }

}

module.exports = new BannerRepository();
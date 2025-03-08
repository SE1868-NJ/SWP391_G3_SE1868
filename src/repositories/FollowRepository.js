const db = require('../models');

class FollowRepository {
  constructor() { }

  async countShopFollowers(shopId) {
    if (!db.Follow) return 0;
    return await db.Follow.count({ where: { shop_id: shopId } });
  }

  // async findFollowRelation(userId, shopId) {
  //   if (!db.Follow) return null;
  //   return await db.Follow.findOne({
  //     where: {
  //       user_id: userId,
  //       shop_id: shopId
  //     }
  //   });
  // }

  // async createFollowRelation(userId, shopId) {
  //   if (!db.Follow) throw new Error("Follow functionality not available");
  //   return await db.Follow.create({
  //     user_id: userId,
  //     shop_id: shopId
  //   });
  // }

  // async deleteFollowRelation(followRelation) {
  //   await followRelation.destroy();
  // }

}

module.exports = new FollowRepository();

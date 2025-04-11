const ShopFollowerRepository = require('../repositories/ShopFollowerRepository');

class ShopFollowerService {
  async toggleFollow(user_id, shop_id) {
    const existingFollow = await ShopFollowerRepository.findByUserAndShop(user_id, shop_id);

    if (existingFollow) {
      await ShopFollowerRepository.delete(user_id, shop_id);
      return { following: false };
    } else {
      await ShopFollowerRepository.create(user_id, shop_id);
      return { following: true };
    }
  }

  async isFollowing(user_id, shop_id) {
    const follow = await ShopFollowerRepository.findByUserAndShop(user_id, shop_id);
    return !!follow;
  }

  async getFollowerCount(shop_id) {
    return await ShopFollowerRepository.countFollowersByShop(shop_id);
  }
  async getFollowers(shopId) {
    if (!shopId) throw new Error("Thiếu shop_id");
    return await ShopFollowerRepository.getFollowersByShopId(shopId);
  }
}

module.exports = new ShopFollowerService();

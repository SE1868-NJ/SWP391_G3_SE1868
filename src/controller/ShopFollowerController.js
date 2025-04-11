const BaseController = require('./baseController');
const ShopFollowerService = require('../services/ShopFollowerService');

class ShopFollowerController extends BaseController {
  // POST /api/followers/toggle
  toggleFollow = async (req, res) => {
    try {
      const { user_id, shop_id } = req.body;

      if (!user_id || !shop_id) {
        return this.convertToJson(res, 400, {
          message: 'user_id và shop_id là bắt buộc',
        });
      }

      const result = await ShopFollowerService.toggleFollow(user_id, shop_id);

      return this.convertToJson(res, 200, {
        message: result.following ? 'Đã theo dõi shop' : 'Đã hủy theo dõi shop',
        following: result.following,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // GET /api/followers/check?user_id=...&shop_id=...
  checkFollow = async (req, res) => {
    try {
      const { user_id, shop_id } = req.query;

      if (!user_id || !shop_id) {
        return this.convertToJson(res, 400, {
          message: 'user_id và shop_id là bắt buộc',
        });
      }

      const isFollowing = await ShopFollowerService.isFollowing(user_id, shop_id);

      return this.convertToJson(res, 200, { following: isFollowing });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // GET /api/followers/count/:shop_id
  getFollowerCount = async (req, res) => {
    try {
      const { shop_id } = req.params;

      if (!shop_id) {
        return this.convertToJson(res, 400, {
          message: 'shop_id là bắt buộc',
        });
      }

      const count = await ShopFollowerService.getFollowerCount(shop_id);

      return this.convertToJson(res, 200, { follower_count: count });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
  convertToJson(res, statusCode, data) {
    return res.status(statusCode).json({
      status: statusCode >= 400 ? "error" : "success",
      data,
    });
  }

  handleError(res, error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Server error",
    });
  }

  getFollowersByShop = async (req, res) => {
    try {
      const shopId = req.params.shopId;

      if (!shopId) {
        return this.convertToJson(res, 400, { message: "Thiếu shop_id" });
      }

      const followers = await ShopFollowerService.getFollowers(shopId);

      return this.convertToJson(res, 200, followers);
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}

module.exports = new ShopFollowerController();

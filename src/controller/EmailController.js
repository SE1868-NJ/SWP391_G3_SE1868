const EmailService = require("../services/emailService");
const BaseController = require("./baseController");

class EmailController extends BaseController {
  sendOrderSuccessEmail = async (req, res) => {
    try {
      const { order_id } = req.body; // hoặc dùng req.params nếu truyền qua URL

      if (!order_id) {
        return this.convertToJson(res, 400, {
          message: "order_id is required",
        });
      }
      console.log("REQ BODY:", req.body);
      console.log("ORDER_ID:", order_id);

      await EmailService.sendOrderSuccessEmail(order_id);

      return this.convertToJson(res, 200, {
        message: `Email thông báo đơn hàng ${order_id} đã được gửi thành công`,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
  
  // Gửi email khuyến mãi tới người theo dõi shop
  sendPromotionToFollowers = async (req, res) => {
    try {
      const { shop_id, promo_title, promo_content, follower_ids } = req.body;
  
      if (!shop_id || !promo_title || !promo_content || !Array.isArray(follower_ids)) {
        return this.convertToJson(res, 400, {
          message: 'Cần cung cấp đủ: shop_id, promo_title, promo_content, và follower_ids',
        });
      }
  
      await EmailService.sendPromotionToFollowers(shop_id, promo_title, promo_content, follower_ids);
  
      return this.convertToJson(res, 200, {
        message: `Email khuyến mãi đã được gửi đến các follower được chọn của shop #${shop_id}`,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
  
  

}

module.exports = new EmailController();

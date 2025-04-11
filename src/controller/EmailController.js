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
}

module.exports = new EmailController();

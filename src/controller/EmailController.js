const EmailService = require("../services/emailService");
const db = require("../models");
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
          message:"Cần cung cấp đủ: shop_id, promo_title, promo_content, và follower_ids",
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
  // Gửi email theo mẫu
  sendTemplateEmail = async (req, res) => {
    try {
      const { to_email, type, replacements } = req.body;

      if (!to_email || !type || !replacements) {
        return this.convertToJson(res, 400, {
          message: "Cần cung cấp đủ: to_email, type, và replacements",
        });
      }

      await EmailService.sendTemplateEmail(to_email, type, replacements);

      return this.convertToJson(res, 200, {
        message: `Email theo mẫu ${type} đã được gửi tới ${to_email}`,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
  sendTemplateEmailToFollowers = async (req, res) => {
    try {
      const { shop_id, type, replacements, follower_ids } = req.body;

      if (!shop_id || !type || !replacements || !Array.isArray(follower_ids)) {
        return this.convertToJson(res, 400, {
          message:
            "Cần cung cấp đủ: shop_id, type, replacements, và follower_ids",
        });
      }

      await EmailService.sendTemplateEmailToFollowers(
        shop_id,
        type,
        replacements,
        follower_ids
      );

      return this.convertToJson(res, 200, {
        message: `Email template '${type}' đã được gửi đến các follower được chọn của shop #${shop_id}`,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
  getAllTemplates = async (req, res) => {
    try {
      const templates = await EmailService.getAllTemplates();
      return this.convertToJson(res, 200, {
        message: "Lấy danh sách email templates thành công",
        data: templates,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
  // Tạo template email mới
  createTemplate = async (req, res) => {
    try {
      const { subject, content, type } = req.body;

      if (!subject || !content || !type) {
        return this.convertToJson(res, 400, {
          message: "Cần cung cấp đủ: subject, content và type",
        });
      }

      const newTemplate = await EmailService.createTemplate(
        subject,
        content,
        type
      );

      return this.convertToJson(res, 201, {
        message: "Tạo mẫu email thành công",
        data: newTemplate,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // Cập nhật template email
  updateTemplate = async (req, res) => {
    try {
      const { id } = req.params;
      const { subject, content } = req.body;

      if (!id || (!subject && !content)) {
        return this.convertToJson(res, 400, {
          message:
            "Phải cung cấp id và ít nhất subject hoặc content để cập nhật",
        });
      }

      const updated = await EmailService.updateTemplate(id, subject, content);

      return this.convertToJson(res, 200, {
        message: "Cập nhật mẫu email thành công",
        data: updated,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // Xóa template email
  deleteTemplate = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return this.convertToJson(res, 400, {
          message: "Cần cung cấp id để xóa mẫu email",
        });
      }

      const result = await EmailService.deleteTemplate(id);

      return this.convertToJson(res, 200, {
        message: result.message,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
  // Lấy danh sách loại email
  getEmailTypes = async (req, res) => {
    try {
      // Fix: Use the db instance to access the model and its static method
      const emailTypes = db.EmailTemplate.getEmailTypes();
      
      return this.convertToJson(res, 200, {
        message: "Lấy danh sách loại email thành công",
        data: emailTypes,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}

module.exports = new EmailController();
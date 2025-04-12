// services/EmailRepository.js
const nodemailer = require("nodemailer");
const db = require('../models');
const EmailTemplate = db.EmailTemplate;

class EmailRepository {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOrderSuccess(toEmail, orderId, fullName) {
    const mailOptions = {
      from: "your_email@gmail.com",
      to: toEmail,
      subject: "Xác nhận đặt hàng thành công",
      html: `
                <h3>Xin chào ${fullName},</h3>
                <p>Chúng tôi đã nhận được đơn hàng <strong>#${orderId}</strong> của bạn.</p>
                <p>Chúng tôi sẽ xử lý đơn hàng và thông báo đến bạn khi đơn hàng được giao.</p>
                <br>
                <p>Trân trọng,<br>Đội ngũ hỗ trợ khách hàng</p>
            `,
    };

    return this.transporter.sendMail(mailOptions);
  }
  // Hàm gửi email tổng quát theo nội dung HTML
  async sendTemplateEmail(toEmail, subject, htmlContent) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    };

    return this.transporter.sendMail(mailOptions);
  }
   // Hàm dựng nội dung và gửi email khuyến mãi
   async sendPromotion(toEmail, shopName, promoTitle, promoContent) {
    const subject = `Ưu đãi mới từ shop ${shopName}`;
    const html = `
      <h3>Shop ${shopName} có khuyến mãi mới!</h3>
      <h4>${promoTitle}</h4>
      <p>${promoContent}</p>
      <br>
      <p>Trân trọng,<br>Đội ngũ hỗ trợ khách hàng</p>
    `;
    return this.sendTemplateEmail(toEmail, subject, html);
  }
  async getTemplateByType(type) {
    try {
      const template = await EmailTemplate.findOne({ where: { type } });
      if (!template) {
        throw new Error(`Không tìm thấy mẫu email cho loại ${type}.`);
      }
      return template;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // Gửi email template đến nhiều người
async sendTemplateEmailToMultipleUsers(type, replacements, users) {
  const template = await this.getTemplateByType(type);
  if (!template) throw new Error(`Không tìm thấy mẫu email cho loại ${type}.`);

  let htmlContent = template.content;
  for (const [key, value] of Object.entries(replacements)) {
    htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }

  const results = await Promise.allSettled(
    users.map(user => {
      if (!user.email) return Promise.resolve(); // bỏ qua user không có email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: template.subject,
        html: htmlContent,
      };
      return this.transporter.sendMail(mailOptions);
    })
  );
  return results;
}
async getAllTemplates() {
  try {
    const templates = await EmailTemplate.findAll({
      attributes: ['id', 'type', 'subject', 'content'],
      order: [['type', 'ASC']],
    });
    return templates;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách mẫu email.");
  }
}
 // === CRUD templates ===
 async getAllTemplates() {
  return await EmailTemplate.findAll({
    attributes: ['id', 'type', 'subject', 'content'],
    order: [['type', 'ASC']],
  });
}

async getTemplateById(id) {
  const template = await EmailTemplate.findByPk(id);
  if (!template) {
    throw new Error("Không tìm thấy mẫu email.");
  }
  return template;
}

async createTemplate({ type, subject, content }) {
  const existing = await EmailTemplate.findOne({ where: { type } });
  if (existing) {
    throw new Error(`Mẫu email với type '${type}' đã tồn tại.`);
  }

  return await EmailTemplate.create({
    type,
    subject,
    content,
    created_at: new Date(),
    updated_at: new Date(),
  });
}

async updateTemplate(id, { subject, content }) {
  const template = await this.getTemplateById(id);
  template.subject = subject;
  template.content = content;
  template.updated_at = new Date();
  await template.save();
  return template;
}

async deleteTemplate(id) {
  const template = await this.getTemplateById(id);
  await template.destroy();
  return true;
}

  
  

}

module.exports = new EmailRepository();

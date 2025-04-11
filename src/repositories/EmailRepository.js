// services/EmailRepository.js
const nodemailer = require("nodemailer");

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

}

module.exports = new EmailRepository();

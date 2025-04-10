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
}

module.exports = new EmailRepository();

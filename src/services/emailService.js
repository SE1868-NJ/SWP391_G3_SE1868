const EmailRepository = require('../repositories/EmailRepository');
const db = require('../models');

class EmailService {
    async sendOrderSuccessEmail(orderId) {
        // Lấy thông tin đơn hàng
        const order = await db.Order.findOne({ where: { order_id: orderId } });
        if (!order || order.status !== 'pending') {
            throw new Error('Order not found or not pending');
        }

        // Lấy thông tin người dùng
        const user = await db.User.findByPk(order.user_id);
        if (!user || !user.email) {
            throw new Error('User email not found');
        }

        // Gửi email qua EmailRepository
        return await EmailRepository.sendOrderSuccess(user.email, order.order_id, user.full_name);
    }
}

module.exports = new EmailService();

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
     
    async sendPromotionToFollowers(shopId, promoTitle, promoContent, followerUserIds) {
      if (!Array.isArray(followerUserIds) || followerUserIds.length === 0) {
        throw new Error('No selected followers provided');
      }
    
      const shop = await db.Shop.findByPk(shopId);
      if (!shop) throw new Error('Shop not found');
    
      const followers = await db.ShopFollower.findAll({
        where: {
          shop_id: shopId,
          user_id: followerUserIds, 
        },
        include: [
          {
            model: db.User,
            as: 'user', 
            attributes: ['email', 'full_name'],
          },
        ],
      });
    
      if (!followers.length) throw new Error('No matched followers found');
    
      return await Promise.allSettled(
        followers.map(f => {
          if (!f.user?.email) return Promise.resolve();
          return EmailRepository.sendPromotion(
            f.user.email,
            shop.shop_name,
            promoTitle,
            promoContent
          );
        })
      );
    }    
    
}

module.exports = new EmailService();

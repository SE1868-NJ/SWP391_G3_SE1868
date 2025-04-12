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
    async sendTemplateEmail(toEmail, type, replacements) {
      try {
        return await EmailRepository.sendTemplateEmail(toEmail, type, replacements);
      } catch (error) {
        throw new Error(`Error sending template email: ${error.message}`);
      }
    }
    async sendTemplateEmailToFollowers(shopId, templateType, replacements, followerUserIds) {
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
    
      return await EmailRepository.sendTemplateEmailToMultipleUsers(
        templateType,
        replacements,
        followers.map(f => f.user)
      );
    }
    async getAllTemplates() {
      try {
        return await EmailRepository.getAllTemplates();
      } catch (error) {
        throw new Error(`Error fetching email templates: ${error.message}`);
      }
    }
    async createTemplate(subject, content, type) {
      try {
        // Kiểm tra type đã tồn tại chưa
        const existing = await db.EmailTemplate.findOne({ where: { type } });
        if (existing) {
          throw new Error(`Template với type "${type}" đã tồn tại.`);
        }
        console.log('Attempting to create template with:', { subject, content, type });
        const newTemplate = await db.EmailTemplate.create({ subject, content, type });
        console.log('Successfully created template:', newTemplate);
        return newTemplate;
      } catch (error) {
        console.error('Detailed error creating template:', error);
        throw new Error(`Error creating template: ${error.message}`);
      }
    }
    
    async updateTemplate(id, subject, content) {
      try {
        const template = await db.EmailTemplate.findByPk(id);
        if (!template) {
          throw new Error('Template not found');
        }
    
        template.subject = subject || template.subject;
        template.content = content || template.content;
        await template.save();
    
        return template;
      } catch (error) {
        throw new Error(`Error updating template: ${error.message}`);
      }
    }
    
    async deleteTemplate(id) {
      try {
        const template = await db.EmailTemplate.findByPk(id);
        if (!template) {
          throw new Error('Template not found');
        }
    
        await template.destroy();
        return { message: 'Template deleted successfully' };
      } catch (error) {
        throw new Error(`Error deleting template: ${error.message}`);
      }
    }
    
  
}

module.exports = new EmailService();

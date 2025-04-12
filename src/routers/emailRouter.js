const express = require('express');
const router = express.Router();
const EmailController = require('../controller/EmailController');

router.post('/send-order-success-email', EmailController.sendOrderSuccessEmail);
router.post('/send-promotion-to-followers', EmailController.sendPromotionToFollowers);
router.post('/send-template-email', EmailController.sendTemplateEmail);
router.post('/send-template-email-to-followers', EmailController.sendTemplateEmailToFollowers);

// Quản lý templates
router.get('/templates', EmailController.getAllTemplates);
router.post('/templates', EmailController.createTemplate);        // Tạo mới
router.put('/templates/:id', EmailController.updateTemplate);     // Cập nhật
router.delete('/templates/:id', EmailController.deleteTemplate);  // Xóa
router.get('/email-types', EmailController.getEmailTypes);   // Lấy thông tin chi tiết

module.exports = router;

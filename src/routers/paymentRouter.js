// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { paymentController, validateCreatePaymentRequest } = require('../controller/PaymentController'); 

router.post(
    '/create_payment_url',
    validateCreatePaymentRequest, 
    paymentController.createPaymentUrl
);

router.get('/vnpay_return', paymentController.handleVnpayReturn); // Sử dụng handleVnpayReturn cho /vnpay_return
router.post('/vnpay_ipn', paymentController.handleVnpayIPN);

// Xóa route /result nếu /vnpay_return đã xử lý việc đó
// router.get('/result', paymentController.handleVnpayReturn);

module.exports = router;
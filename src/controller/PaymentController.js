// src/controllers/paymentController.js
const BaseController = require("./baseController"); // Giả sử đường dẫn đúng
const paymentService = require("../services/paymentService");
const orderService = require("../services/orderService");
const orderRepository = require("../repositories/OrderRepository"); // Cần cho findByTxnRef
const config = require('../config/default'); // Sử dụng thư viện node-config
const { validationResult, body } = require('express-validator');
const db = require('../models');

const validateCreatePaymentRequest = [
    body('amount').isNumeric().toFloat().isFloat({ gt: 0 }),
    body('orderDescription').optional().isString().trim(),
    body('bankCode').optional().isString().trim(),
    body('language').optional().isIn(['vn', 'en']),
    body('orderId').isNumeric().toInt(),
];

class PaymentController extends BaseController {
    constructor() {
        super();
    }

    createPaymentUrl = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        const paymentData = {
            ...req.body,
            ipAddr: ipAddr?.replace('::ffff:', ''),
        };
        console.log("Payment Data:", paymentData);

        try {
            // const order = await orderService.getOrderWithDetails(paymentData.orderId); // Sử dụng orderService
            // if (!order || order.status !== 'pending_payment') {
            //      return this.handleError(res, { statusCode: 404, message: 'Đơn hàng không hợp lệ hoặc đã được xử lý.' });
            // }
            // if (order.total !== paymentData.amount) {
            //     return this.handleError(res, { statusCode: 400, message: 'Số tiền thanh toán không khớp với đơn hàng.' });
            // }

            const { paymentUrl, vnpTxnRef } = await paymentService.createPaymentUrl(paymentData);
            // await orderService.updateOrder(paymentData.orderId, { vnp_txn_ref: vnpTxnRef }); // Sử dụng orderService

            this.convertToJson(res, 200, {
                message: 'Tạo URL thanh toán VNPay thành công',
                paymentUrl: paymentUrl
            });

        } catch (error) {
            this.handleError(res, error);
        }
    }

    handleVnpayReturn = async (req, res) => {
        console.log("--- VNPay Return Received ---");
        console.log("Query Params:", req.query);

        const vnp_Params = req.query;
        const frontendReturnUrl = config.frontend.returnUrl; // Lấy từ config

        const isValidSignature = paymentService.verifySignature(vnp_Params);
        const txnRef = vnp_Params['vnp_TxnRef'];
        const responseCode = vnp_Params['vnp_ResponseCode'];
        const transactionNo = vnp_Params['vnp_TransactionNo'];
        const vnp_SecureHash = vnp_Params['vnp_SecureHash'];
        const amount = parseInt(vnp_Params['vnp_Amount'] || '0', 10) / 100;

        let redirectUrl = `${frontendReturnUrl}?orderId=${txnRef || 'unknown'}&responseCode=${responseCode}`;
        if (isValidSignature) {
            console.log("Return Signature: Valid");
            if (responseCode === '00') {
                redirectUrl += `&success=true&amount=${amount}&message=Giao dịch thành công! Đang chờ xác nhận cuối cùng.`;
            } else {
                redirectUrl += `&success=false&message=Giao dịch thất bại hoặc bị hủy (Mã lỗi: ${responseCode})`;
            }
        } else {
            redirectUrl += `&success=false&message=Lỗi xác thực kết quả giao dịch.`;
        }
        res.redirect(redirectUrl);
    }

    handleVnpayIPN = async (req, res) => {

        const vnp_Params = req.body;
        let RspCode = '99';
        let Message = 'Unknown error';

        try {
            const orderId = vnp_Params.orderId;
            const responseCode = vnp_Params.responseCode;

            const orders = await orderService.getOrderById(orderId);

            if (!orders) {
                RspCode = '01';
                Message = 'Order not found';
            } else {
                for (let order of orders) {
                    if (order.payment_status === db.Order.ORDER_UNPAID) {
                        console.log(order.payment_status);
                        if (responseCode === '00') {
                            const status = await orderService.updatePaymentStatusByOrderId(orderId, db.Order.ORDER_PAID);
                            RspCode = '00';
                            Message = 'Confirm Success';
                        } else {
                            console.log(`IPN: Transaction failed for order ${order.order_id}. Response Code: ${responseCode}. Keeping status as 'pending_payment'.`);
                            RspCode = '00';
                            Message = 'Confirm Success (but transaction failed)';
                        }
                    } else if (order.payment_status === 1) {
                        RspCode = '00';
                        Message = 'Order already confirmed successfully';
                    } else {
                        RspCode = '02';
                        Message = 'Order status is not pending payment';
                    }
                }
            }
        } catch (error) {
            console.error("IPN Handler Error:", error);
            RspCode = '99';
            Message = 'Internal Server Error';
        } finally {
            res.status(200).json({ RspCode: RspCode, Message: Message });
        }
    }
}

module.exports = {
    paymentController: new PaymentController(),
    validateCreatePaymentRequest
};
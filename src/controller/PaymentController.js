// src/controllers/paymentController.js
const BaseController = require("./baseController"); // Giả sử đường dẫn đúng
const paymentService = require("../services/paymentService");
const orderService = require("../services/orderService");
const orderRepository = require("../repositories/OrderRepository"); // Cần cho findByTxnRef
const config = require('../config/default'); // Sử dụng thư viện node-config
const { validationResult, body } = require('express-validator');

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
        const amount = parseInt(vnp_Params['vnp_Amount'] || '0', 10) / 100;

        let redirectUrl = `${frontendReturnUrl}?orderId=${txnRef || 'unknown'}`;

        if (isValidSignature) {
            console.log("Return Signature: Valid");
            if (responseCode === '00') {
                console.log(`Return: Transaction successful for TxnRef: ${txnRef}, VNPay TxnNo: ${transactionNo}`);
                redirectUrl += `&success=true&amount=${amount}&message=Giao dịch thành công! Đang chờ xác nhận cuối cùng.`;
            } else {
                console.log(`Return: Transaction failed or cancelled for TxnRef: ${txnRef}. Response Code: ${responseCode}`);
                redirectUrl += `&success=false&message=Giao dịch thất bại hoặc bị hủy (Mã lỗi: ${responseCode})`;
            }
        } else {
            console.warn(`Return Signature: Invalid for TxnRef: ${txnRef}`);
            redirectUrl += `&success=false&message=Lỗi xác thực kết quả giao dịch.`;
        }

        console.log("Redirecting to:", redirectUrl);
        res.redirect(redirectUrl);
    }

    handleVnpayIPN = async (req, res) => {
        console.log("--- VNPay IPN Received ---");
        console.log("Query Params:", req.query);

        const vnp_Params = req.query;
        let RspCode = '99';
        let Message = 'Unknown error';

        try {
            const isValidSignature = paymentService.verifySignature(vnp_Params);

            if (!isValidSignature) {
                console.warn("IPN Signature: Invalid");
                RspCode = '97';
                Message = 'Invalid Signature';
            } else {
                console.log("IPN Signature: Valid");
                const txnRef = vnp_Params['vnp_TxnRef'];
                const responseCode = vnp_Params['vnp_ResponseCode'];
                const amount = parseInt(vnp_Params['vnp_Amount'] || '0', 10) / 100;
                const transactionNo = vnp_Params['vnp_TransactionNo'];

                const order = await orderRepository.findByTxnRef(txnRef); // Dùng repo để tìm

                if (!order) {
                    console.warn(`IPN: Order not found for TxnRef: ${txnRef}`);
                    RspCode = '01';
                    Message = 'Order not found';
                } else {
                    console.log(`IPN: Found order ${order.order_id} for TxnRef: ${txnRef}`);

                    if (order.total !== amount) {
                        console.warn(`IPN: Amount mismatch for order ${order.order_id}. Expected: ${order.total}, Received: ${amount}`);
                        RspCode = '04';
                        Message = 'Invalid Amount';
                    } else if (order.status !== 'pending_payment') {
                        console.log(`IPN: Order ${order.order_id} status is already '${order.status}'. TxnRef: ${txnRef}`);
                        if (order.status === 'paid') {
                            RspCode = '00';
                            Message = 'Order already confirmed successfully';
                        } else {
                            RspCode = '02';
                            Message = 'Order status is not pending payment';
                        }
                    } else {
                        if (responseCode === '00') {
                            console.log(`IPN: Transaction successful for order ${order.order_id}. Updating status to 'paid'.`);
                            await orderService.updateOrderStatusByTxnRef(txnRef, 'paid', { vnpTransactionNo: transactionNo }); // Dùng service để cập nhật
                            RspCode = '00';
                            Message = 'Confirm Success';
                        } else {
                            console.log(`IPN: Transaction failed for order ${order.order_id}. Response Code: ${responseCode}. Updating status to 'payment_failed'.`);
                            await orderService.updateOrderStatusByTxnRef(txnRef, 'payment_failed', { vnpResponseCode: responseCode }); // Dùng service để cập nhật
                            RspCode = '00';
                            Message = 'Confirm Success (but transaction failed)';
                        }
                    }
                }
            }
        } catch (error) {
            console.error("IPN Handler Error:", error);
            RspCode = '99';
            Message = 'Internal Server Error';
        } finally {
            console.log(`IPN Response to VNPay: RspCode=${RspCode}, Message=${Message}`);
            res.status(200).json({ RspCode: RspCode, Message: Message });
        }
    }
}

module.exports = {
    paymentController: new PaymentController(),
    validateCreatePaymentRequest 
};
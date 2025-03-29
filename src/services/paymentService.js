// src/services/paymentService.js
const config = require('../config/default');
const moment = require('moment'); // Sử dụng moment
const qs = require('qs');
const crypto = require('crypto');
const sortObject = require('../utils/sortObject'); // Sử dụng hàm sortObject mới từ demo

class PaymentService {
    constructor() { }

    async createPaymentUrl(data) {
        try {
            const { ipAddr: originalIpAddr, amount, orderId, bankCode, language } = data;

            const vnpConfig = config.vnpay;
            const tmnCode = vnpConfig.tmnCode;
            const secretKey = vnpConfig.hashSecret;
            let vnpUrl = vnpConfig.url;
            const returnUrl = vnpConfig.returnUrl;
            const apiVersion = vnpConfig.apiVersion || '2.1.0'; 
            const date = new Date();
            const createDate = moment(date).format('YYYYMMDDHHmmss');
            // const orderId = moment(date).format('DDHHmmss');
            const ipAddr = '1.53.210.130';

            let locale = language;
            if (!locale || !['vn', 'en'].includes(locale)) {
                locale = 'vn';
            }
            const currCode = 'VND';
            const vnpAmount = Math.round(amount * 100);
            const orderInfo = 'Thanh toan cho ma GD:' + orderId;

            let vnp_Params = {};
            vnp_Params['vnp_Version'] = apiVersion;
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = orderInfo;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = vnpAmount;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            if (bankCode) {
                vnp_Params['vnp_BankCode'] = bankCode;
            }
            let sortedParams = sortObject(vnp_Params);
            const signData = qs.stringify(sortedParams, { encode: false });

            const hmac = crypto.createHmac("sha512", secretKey);
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            sortedParams['vnp_SecureHash'] = signed;
            const finalQueryString = qs.stringify(sortedParams, { encode: false });

            vnpUrl += '?' + finalQueryString;

            return { paymentUrl: vnpUrl, vnpTxnRef: orderId };

        } catch (error) {
            throw new Error(`Không thể tạo URL thanh toán VNPay (Demo Logic): ${error.message || error}`);
        }
    }

    verifySignature(vnp_Params) {
        try {
            const vnpConfig = config.vnpay;
            const secretKey = vnpConfig.hashSecret;
            const secureHash = vnp_Params['vnp_SecureHash'];

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            const sortedParamsVerify = sortObject(vnp_Params);
            const signDataVerify = qs.stringify(sortedParamsVerify, { encode: false });

            const hmac = crypto.createHmac("sha512", secretKey);
            const generatedHash = hmac.update(Buffer.from(signDataVerify, 'utf-8')).digest("hex");

            return secureHash === generatedHash;

        } catch (error) {
            return false;
        }
    }
}

module.exports = new PaymentService();
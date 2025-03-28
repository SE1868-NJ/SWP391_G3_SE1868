// src/services/paymentService.js
const config = require('../config/default');
const moment = require('moment'); // Sử dụng moment
const qs = require('qs');
const crypto = require('crypto');
const sortObject = require('../utils/sortObject'); // Sử dụng hàm sortObject mới từ demo

class PaymentService {
    constructor() {}

    async createPaymentUrl(data) {
        console.log("--- [VNPay Service - Following Demo Logic] Start ---");
        try {
            const { ipAddr: originalIpAddr, amount, bankCode, language } = data; // Lấy các tham số cần thiết

            // Lấy cấu hình theo cấu trúc của bạn
            const vnpConfig = config.vnpay;
            const tmnCode = vnpConfig.tmnCode;
            const secretKey = vnpConfig.hashSecret; // *** Đảm bảo chính xác ***
            let vnpUrl = vnpConfig.url;
            const returnUrl = vnpConfig.returnUrl;
            const apiVersion = vnpConfig.apiVersion || '2.1.0'; // Lấy từ config hoặc mặc định

            // Đặt múi giờ (tùy chọn, nhưng demo có làm)
            // process.env.TZ = 'Asia/Ho_Chi_Minh'; // Cân nhắc ảnh hưởng toàn cục

            const date = new Date();
            // Tạo createDate và orderId bằng moment theo demo
            const createDate = moment(date).format('YYYYMMDDHHmmss');
            // Lưu ý: orderId này không đảm bảo unique nếu có nhiều giao dịch trong cùng giây
            const orderId = moment(date).format('DDHHmmss');
            console.log("[DEMO LOGIC] CreateDate:", createDate);
            console.log("[DEMO LOGIC] Generated OrderId (TxnRef):", orderId);


            // Sử dụng IP (vẫn hardcode để test local)
            // const ipAddr = originalIpAddr?.replace('::ffff:', '') || '1.53.210.130'; // Lấy từ input hoặc hardcode
            const ipAddr = '1.53.210.130'; // !! TEST ONLY !!
            console.log("[DEMO LOGIC] Using IP Address:", ipAddr);


            let locale = language;
            if (!locale || !['vn', 'en'].includes(locale)) {
                locale = 'vn';
            }
            const currCode = 'VND';
            const vnpAmount = Math.round(amount * 100);
            // Tạo OrderInfo theo demo
            const orderInfo = 'Thanh toan cho ma GD:' + orderId;

            let vnp_Params = {};
            vnp_Params['vnp_Version'] = apiVersion;
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = orderId; // Dùng orderId tạo bằng moment
            vnp_Params['vnp_OrderInfo'] = orderInfo; // Dùng orderInfo tạo theo demo
            vnp_Params['vnp_OrderType'] = 'other'; // Demo dùng 'other'
            vnp_Params['vnp_Amount'] = vnpAmount;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            // *** KHÔNG CÓ vnp_ExpireDate THEO CODE DEMO ***
            if (bankCode) { // Giữ lại logic bankCode nếu có
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            console.log("[DEMO LOGIC] Params BEFORE sorting:", JSON.stringify(vnp_Params, null, 2));

            // Sử dụng hàm sortObject MỚI (từ demo)
            let sortedParams = sortObject(vnp_Params);
            console.log("[DEMO LOGIC] Params AFTER sorting (Encoded keys/values):", JSON.stringify(sortedParams, null, 2));

            // Tạo signData bằng qs({ encode: false }) theo demo
            const signData = qs.stringify(sortedParams, { encode: false });
            console.log("[DEMO LOGIC] String to Sign (From QS):", signData);

            const hmac = crypto.createHmac("sha512", secretKey);
            // Sử dụng Buffer.from thay vì new Buffer
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            console.log("[DEMO LOGIC] Generated Signature:", signed);

            // Thêm chữ ký vào object ĐÃ SORT (và đã encode key/value bởi sortObject)
            sortedParams['vnp_SecureHash'] = signed;
            console.log("[DEMO LOGIC] Params WITH Signature:", JSON.stringify(sortedParams, null, 2));


            // Tạo URL cuối cùng bằng qs({ encode: false }) theo demo
            const finalQueryString = qs.stringify(sortedParams, { encode: false });
            console.log("[DEMO LOGIC] Final Query String (Not URL Encoded by QS):", finalQueryString);

            vnpUrl += '?' + finalQueryString;

            console.log("[DEMO LOGIC] Final Generated VNPay URL:", vnpUrl);
            console.log("--- [VNPay Service - Following Demo Logic] End ---");

            // Trả về URL và TxnRef (orderId theo demo)
            return { paymentUrl: vnpUrl, vnpTxnRef: orderId };

        } catch (error) {
            console.error("!!! [VNPay Service - Demo Logic] Error:", error);
             throw new Error(`Không thể tạo URL thanh toán VNPay (Demo Logic): ${error.message || error}`);
        }
    }

    verifySignature(vnp_Params) {
       // *** CẦN CẬP NHẬT LOGIC NÀY CHO GIỐNG VỚI DEMO /vnpay_return ***
       try {
            const vnpConfig = config.vnpay;
            const secretKey = vnpConfig.hashSecret;
            const secureHash = vnp_Params['vnp_SecureHash'];

            // Xóa hash và type hash theo demo
            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            // Sort lại bằng hàm sortObject MỚI (từ demo)
            const sortedParamsVerify = sortObject(vnp_Params);
            console.log("[DEMO LOGIC - Verify] Params AFTER sorting (Encoded):", JSON.stringify(sortedParamsVerify, null, 2));


            // Tạo lại signDataVerify bằng qs({ encode: false }) theo demo
            const signDataVerify = qs.stringify(sortedParamsVerify, { encode: false });
            console.log("[DEMO LOGIC - Verify] String to Verify (From QS):", signDataVerify);

            const hmac = crypto.createHmac("sha512", secretKey);
            const generatedHash = hmac.update(Buffer.from(signDataVerify, 'utf-8')).digest("hex");

            console.log("[DEMO LOGIC - Verify] Received Hash:", secureHash);
            console.log("[DEMO LOGIC - Verify] Generated Hash for verification:", generatedHash);

            return secureHash === generatedHash;

        } catch (error) {
            console.error("[DEMO LOGIC - Verify] Error verifying VNPay signature:", error);
            return false;
        }
    }
}

module.exports = new PaymentService();
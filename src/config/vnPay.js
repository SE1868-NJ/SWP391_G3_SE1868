module.exports = {
    tmnCode: process.env.VNP_TMN_CODE || "YOUR_TEST_TMN_CODE",
    hashSecret: process.env.VNP_HASH_SECRET || "YOUR_TEST_HASH_SECRET",
    url: process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    returnUrl: process.env.VNP_RETURN_URL || "http://localhost:3001/api/payment/vnpay_return",
    apiVersion: '2.1.0'
};
const vnpayConfig = require('./vnPay');

module.exports = {
    vnpay: vnpayConfig,

    frontend: {
        returnUrl: process.env.FRONTEND_RETURN_URL || "http://localhost:3000/payment-result"
    },
};
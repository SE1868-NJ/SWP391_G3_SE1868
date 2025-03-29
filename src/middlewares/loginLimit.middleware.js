const rateLimit = require('express-rate-limit');

const loginLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 phút
    max: 3, // Giới hạn 3 lần thử đăng nhập trong 1 phút
    message: {
        success: false,
        message: 'Quá nhiều lần đăng nhập không thành công. Vui lòng thử lại sau.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
        // Định danh theo email nếu có, nếu không thì dùng IP
        return req.body.email || req.ip;
    },
    handler: (req, res) => {
        // Tính toán thời gian còn lại
        const timeLeft = Math.ceil(req.rateLimit.resetTime.getTime() - Date.now()) / 1000;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = Math.floor(timeLeft % 60);

        res.status(429).json({
            success: false,
            message: 'Quá nhiều lần đăng nhập không thành công. Vui lòng thử lại sau.',
            retryAfter: `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`,
            retryAfterSeconds: Math.ceil(timeLeft)
        });
    }
});

module.exports = { loginLimit };
const rateLimit = require('express-rate-limit');

const loginLimit = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { loginLimit };
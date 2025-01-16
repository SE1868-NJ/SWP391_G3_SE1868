const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

const sendMessage = async (message) => {
    try {
        const response = await axios.post(TELEGRAM_API_URL, {
            chat_id: CHAT_ID,
            text: message,
        });
        console.log('Message sent:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
};

const scheduleTelegramJob = () => {
    cron.schedule('0 8 * * *', () => {
        const message = 'test message';
        sendMessage(message);
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"  
    });
};

module.exports = scheduleTelegramJob;

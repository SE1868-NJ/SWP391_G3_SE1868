const orderService = require('../services/orderService');
const cron = require('node-cron');

const updateStatusOrder = async (status) => {
    try {
        console.log(`Update status order to ${status}`);
        const orders = await orderService.getOrders();
        for (let order of orders) {
            if (order.status === status) {
                await orderService.updateOrderStatus(order.order_id, status);
            }
            if (order.status === status) {
                await orderService.updateOrderStatus(order.order_id, status);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

const scheduleUpdateStatusOrder = () => {
    cron.schedule('*/2 * * * *', () => {
        updateStatusOrder("DELIVERY");
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    });

    cron.schedule('*/5 * * * *', () => {
        updateStatusOrder("COMPLETED");
    }, {
        scheduled: true,
        timezone: "Asia/Ho_Chi_Minh"
    });
};


module.exports = scheduleUpdateStatusOrder;
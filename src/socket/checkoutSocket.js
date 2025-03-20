const orderService = require('../services/orderService');

const checkoutSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        // Khi shop tham gia phòng WebSocket
        socket.on('join-checkout', (shopId) => {
            socket.join(`checkout-${shopId}`);  // Shop sẽ vào phòng 'checkout-{shopId}'
            console.log(`Shop joined checkout-${shopId}`);
        });

        // Khi người dùng nhấn checkout, phát sự kiện 'checkout'
        socket.on('order_placed', async (data) => {
            try {
                console.log('Checkout received:', data);

                // Tạo đơn hàng từ dữ liệu checkout gửi tới
                const order = {
                    order_id: Math.floor(Math.random() * 1000),
                    ...data,  // Nếu có thêm dữ liệu đơn hàng từ frontend
                };

                // Giả sử mỗi sản phẩm có shop_id để lọc đơn hàng cho từng shop
                const shopsToNotify = new Set(data.items.map(item => item.shop_id));

                shopsToNotify.forEach(shopId => {
                    // Chỉ phát sự kiện tới phòng của shop trong 'checkout-{shopId}'
                    io.to(`checkout-${shopId}`).emit('new_order', {
                        order_id: order.order_id,
                        shop_id: shopId,
                        order_items: data.items.filter(item => item.shop_id === shopId),
                    });
                    console.log(`Order ${order.order_id} sent to shop ${shopId}`);
                });

            } catch (error) {
                console.error("Error during checkout:", error);
            }
        });

        // Khi người dùng ngắt kết nối
        socket.on('disconnect', () => {
            console.log('A user disconnected', socket.id);
        });
    });
};

module.exports = checkoutSocket;

const orderService = require('../services/orderService');
const orderDetailRepository = require('../repositories/OrderDetailRepository');
const userRepository = require('../repositories/UserRepository');

const checkoutSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        socket.on('join-checkout', (shopId) => {
            socket.join(`checkout-${shopId}`); 
            console.log(`Shop joined checkout-${shopId}`);
        });

        socket.on('order_placed', async (data) => {
            try {
                const orders= await orderService.createOrder(data);
                
                for (let order of orders) {
                    const orderDetails = await orderDetailRepository.getOrderDetailsByOrderId(order.order_id);
                  
                    const formattedOrderDetails = orderDetails.map(item => ({
                        id: item.id,
                        product_id: item.product_id,
                        price: parseFloat(item.price).toFixed(2),
                        quantity: item.quantity,
                        subtotal: parseFloat(item.subtotal).toFixed(2), 
                        Product: {
                          product_name: item.Product.product_name,
                          image_url: item.Product.image_url || null,  
                          import_price: parseFloat(item.Product.import_price).toFixed(2), 
                          sale_price: parseFloat(item.Product.sale_price).toFixed(2)  
                        }
                      }));
                    const user = await userRepository.getUserById(order.user_id);
                  
                    io.to(`checkout-${order.shop_id}`).emit('new_order', {
                      order_id: order.order_id,
                      user_id: order.user_id,
                      full_name: user.name,
                      phone: user.phone,
                      address_id: order.address_id,
                      voucher_id: order.voucher_id,
                      payment_method: order.payment_method,
                      note: order.note,
                      total: parseFloat(order.total).toFixed(2), 
                      status: order.status,
                      created_at: order.created_at,
                      updated_at: order.updated_at,
                      shop_id: order.shop_id,
                      OrderDetails: formattedOrderDetails,
                    });
                  
                }

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

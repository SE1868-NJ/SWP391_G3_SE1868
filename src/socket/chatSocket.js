const messageService = require('../services/messageService');

const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);
        socket.on('join-conversation', (conversationId) => {
            socket.join(`conversation-${conversationId}`);
            io.to(`conversation-${conversationId}`).emit('receive_message', {
                messageText: "Joined room successfully",
                senderId: "system"
            });
            socket.on('send-message', async (data) => {
                console.log(data)
                try {
                    const { conversationId, senderId, senderType, messageText } = data;
                    const message = await messageService.sendMessage(
                        conversationId,
                        senderId,
                        senderType,
                        messageText
                    );
                    console.log(1)

                    io.to(`conversation-${conversationId}`).emit('receive_message', {
                        messageText: messageText,
                        senderId: "system"
                    });
                } catch (error) {
                    socket.emit('error', { message: error.message });
                }
            });
        });

        socket.on('leave-conversation', (conversationId) => {
            socket.leave(`conversation-${conversationId}`);
        });


        socket.on('disconnect', () => {
            // Handle cleanup if needed
        });
    });
};

module.exports = setupChatSocket;
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
                    const { conversation_id, sender_id, sender_type, message_text } = data;
                    const message = await messageService.sendMessage(
                        conversation_id,
                        sender_id,
                        sender_type,
                        message_text
                    );
                    console.log(1)

                    io.to(`conversation-${conversationId}`).emit('receive_message', {
                        messageText: message_text,
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
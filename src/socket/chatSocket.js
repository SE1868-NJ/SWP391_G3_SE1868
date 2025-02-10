const messageService = require('../services/messageService');

const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
        socket.on('join-conversation', (conversationId) => {
            socket.join(`conversation-${conversationId}`);
            socket.on('send-message', async (data) => {
                try {
                    const { conversation_id, sender_id, sender_type, message_text } = data;
                    await messageService.sendMessage(
                        conversation_id,
                        sender_id,
                        sender_type,
                        message_text
                    );

                    io.to(`conversation-${conversationId}`).emit('receive_message', {
                        message_text: message_text,
                        sender_id: sender_id
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
            console.log('A user disconnected', socket.id);
        });
    });
};

module.exports = setupChatSocket;
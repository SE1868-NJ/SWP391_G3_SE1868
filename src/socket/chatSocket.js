const messageService = require('../services/messageService');

const setupChatSocket = (io) => {
    io.on('connection', (socket) => {
        // Store the current conversation's message handler
        let currentMessageHandler = null;

        socket.on('join-conversation', (conversationId) => {
            // Remove previous message handler if exists
            if (currentMessageHandler) {
                socket.off('send-message', currentMessageHandler);
            }

            socket.join(`conversation-${conversationId}`);

            // Create new message handler
            currentMessageHandler = async (data) => {
                try {
                    const { conversation_id, sender_id, sender_type, message_text, message_type, media_url } = data;
                    const message = await messageService.sendMessage(
                        conversation_id,
                        sender_id,
                        sender_type,
                        message_text,
                        message_type,
                        media_url
                    );

                    io.to(`conversation-${conversationId}`).emit('receive_message', {
                        message_text: message_text,
                        sender_id: sender_id,
                        message_type: message_type,
                        media_url: media_url
                    });
                } catch (error) {
                    socket.emit('error', { message: error.message });
                }
            };

            // Add new message handler
            socket.on('send-message', currentMessageHandler);
        });

        socket.on('leave-conversation', (conversationId) => {
            socket.leave(`conversation-${conversationId}`);
            // Remove message handler when leaving
            if (currentMessageHandler) {
                socket.off('send-message', currentMessageHandler);
                currentMessageHandler = null;
            }
        });

        socket.on('disconnect', () => {
            // Clean up message handler on disconnect
            if (currentMessageHandler) {
                socket.off('send-message', currentMessageHandler);
                currentMessageHandler = null;
            }
            console.log('A user disconnected', socket.id);
        });
    });
};
module.exports = setupChatSocket;
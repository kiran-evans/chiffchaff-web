const Chat = require('./model/chatModel');
const Message = require('./model/messageModel');
const User = require('./model/userModel');

module.exports = io => {
    io.on('connection', socket => {

        socket.on('connect_error', err => {
            throw new Error(err);
        });

        socket.on('ONLINE_INIT', user => {
            socket.join(user._id.toString());
        });

        socket.on('ALERT', params => {
            socket.emit('ALERT', { severity: params.severity, text: params.text });
        });

        socket.on('CHAT_REQUEST', async params => {
            const { userData, contactData } = params;

            try {
                const foundUser = await User.findById(userData._id.toString());
                const foundContact = await User.findById(contactData._id.toString());

                if (foundUser.isArchived) {
                    return io.sockets.in(userData._id.toString()).emit('ALERT', { severity: 'error', text: `You cannot send contact requests because your account is archived.` });
                }
                if (foundContact.isArchived) {
                    return io.sockets.in(userData._id.toString()).emit('ALERT', { severity: 'error', text: `${contactData.username} cannot receive contact requests because their account is archived.` });
                }

                await User.findByIdAndUpdate(contactData._id.toString(), {
                    chatRequests: [...contactData.chatRequests, userData._id.toString()]
                });
                io.sockets.in(contactData._id.toString()).emit('CHAT_REQUEST', userData);
                io.sockets.in(contactData._id.toString()).emit('ALERT', { severity: 'info', text: `${userData.username} sent you a contact request.` });
                
                io.sockets.in(userData._id.toString()).emit('ALERT', { severity: 'success', text: `Request sent.` });
            } catch (err) {
                throw new Error(err);
            }
        });

        socket.on('CHAT_ACCEPT', async params => {
            const { recipientData, senderData } = params;

            try {
                const newChat = new Chat({
                    participants: [recipientData._id.toString(), senderData._id.toString()],
                    lastModified: Date()
                });

                await newChat.save();

                let tempChatRequests = [...recipientData.chatRequests];
                tempChatRequests.splice(recipientData.chatRequests.indexOf(senderData._id.toString()), 1);
                await User.findByIdAndUpdate(recipientData._id, {
                    chats: [...recipientData.chats, newChat._id.toString()],
                    chatRequests: [...tempChatRequests]
                });
                io.sockets.in(recipientData._id.toString()).emit('REFRESH_USER_DATA');
                io.sockets.in(recipientData._id.toString()).emit('ALERT', { severity: 'info', text: `${senderData.username} has been added to your contacts.` });

                await User.findByIdAndUpdate(senderData._id, {
                    chats: [...senderData.chats, newChat._id.toString()]
                });
                io.sockets.in(senderData._id.toString()).emit('REFRESH_USER_DATA');
                io.sockets.in(senderData._id.toString()).emit('ALERT', { severity: 'success', text: `${recipientData.username} accepted your contact request.` });

            } catch (err) {
                throw new Error(err);
            }
        });

        socket.on('SELECT_CHAT', params => {
            const { leavingChat, joiningChat } = params;
            if (leavingChat) socket.leave(leavingChat._id.toString());
            socket.join(joiningChat._id.toString());
        });

        socket.on('MESSAGE_SEND', async params => {
            const { userData, contactData, msgBody, chatData } = params;

            try {
                const foundUser = await User.findById(userData._id.toString());
                const foundContact = await User.findById(contactData._id.toString());

                if (foundUser.isArchived) {
                    return io.sockets.in(userData._id.toString()).emit('ALERT', { severity: 'error', text: `You cannot send messages because your account is archived.` });
                }
                if (foundContact.isArchived) {
                    return io.sockets.in(userData._id.toString()).emit('ALERT', { severity: 'error', text: `${contactData.username} cannot receive messages because their account is archived.` });
                }
                
                const newMessage = new Message({
                    senderId: userData._id.toString(),
                    dateSent: Date(),
                    body: msgBody
                });

                io.sockets.in(chatData._id.toString()).emit('ADD_MESSAGE', newMessage);

                const foundChat = await Chat.findById(chatData._id.toString());

                await Chat.findByIdAndUpdate(chatData._id, {
                    messages: [...foundChat._doc.messages, newMessage],
                    lastModified: Date()
                });

            } catch (err) {
                throw new Error(err);
            }
        });

        socket.on('REMOVE_CONTACT', async params => {
            const { userData, contactData, chatData } = params;

            try {
                let tempUser = { ...userData };
                let tempChat = { ...chatData };

                for await (let participantId of tempChat.participants) {
                    if (participantId === userData._id.toString()) {
                        tempChat.participants[tempChat.participants.indexOf(userData._id.toString())] = null; // remove user details from chat
                        break;
                    }
                }

                await Chat.findByIdAndUpdate(chatData._id.toString(), {
                    ...tempChat,
                    lastModified: Date()
                });

                for await (let chatId of tempUser.chats) {
                    if (chatId === tempChat._id.toString()) {
                        tempUser.chats.splice(tempUser.chats.indexOf(chatId), 1);
                    }
                }

                await User.findByIdAndUpdate(userData._id.toString(), {
                    ...tempUser
                });

                io.sockets.in(userData._id.toString()).emit('REFRESH_USER_DATA');
                io.sockets.in(contactData._id.toString()).emit('REFRESH_USER_DATA');

            } catch (err) {
                throw new Error(err);
            }
        });
    });
}
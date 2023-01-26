const Chat = require('./model/chatModel');
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

        socket.on('CONTACT_REQUEST', async params => {
            const { userData, contactData } = params;

            try {
                io.sockets.in(contactData._id.toString()).emit('CONTACT_REQUEST', userData);
                io.sockets.in(contactData._id.toString()).emit('ALERT', { severity: 'info', text: `${userData.username} sent you a contact request.` });
                
                io.sockets.in(userData._id.toString()).emit('ALERT', { severity: 'success', text: `Request sent.` });
            } catch (err) {
                throw new Error(err);
            }
        });

        socket.on('CONTACT_ACCEPT', async params => {
            const { user1Data, user2Data } = params;

            try {
                const newChat = new Chat({
                    participants: [user1Data._id.toString(), user2Data._id.toString()]
                });

                await newChat.save();

                await User.findByIdAndUpdate(user1Data._id, {
                    chats: [...user1Data.chats, newChat._id.toString()]
                });
                io.sockets.in(user1Data._id.toString()).emit('REFRESH_USER_DATA');

                await User.findByIdAndUpdate(user2Data._id, {
                    chats: [...user2Data.chats, newChat._id.toString()]
                });
                io.sockets.in(user2Data._id.toString()).emit('REFRESH_USER_DATA');

            } catch (err) {
                throw new Error(err);
            }
        });
    });
}
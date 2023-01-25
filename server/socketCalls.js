const User = require('./model/userModel');

module.exports = io => {
    io.on('connection', socket => {

        socket.on('connect_error', err => {
            throw new Error(err);
        });

        socket.on('ONLINE_INIT', user => {
            socket.join(user._id.toString());
        });

        socket.on('CONTACT_REQUEST', async params => {
            const { userData, contactData } = params;

            try {
                io.sockets.in(contactData._id.toString()).emit('CONTACT_REQUEST', userData);

            } catch (err) {
                throw new Error(err);
            }
        });
    });
}
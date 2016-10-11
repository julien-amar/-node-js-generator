function registerChat(io) {
    var messages = [];

    io.on('connection', function(socket) {
        socket.emit('all messages', messages);

        socket.on('new message', function(data) {
            messages.push(data);

            io.emit('new message', data);
        });
    });
}

module.exports = {
    registerChat: registerChat
}
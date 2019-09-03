module.exports = (io) => {
    let users = new Set();
    io.sockets
        .on('connection', (socket) => {
            let id = socket.id;
            let user = null;

            socket.on('users:connect', (data) => {
                user = {
                    id,
                    username: data.username
                }
                users.add(user)
                console.log('User connected to chat: ' + id);
                socket.emit('users:list', [...users]);
                socket.broadcast.emit('users:add', user);
            })
            

            socket.on('message:add', (data) => {
                if (io.sockets.connected[data.roomId]) {
                    io.to(data.roomId).emit('message:add', data, id);
                }
            });

            socket.on('disconnect', (data) => {
                console.log('User disconnected from chat: ' + id);
                users.delete(user)

                socket.broadcast.emit('users:leave', id);
            });
        })

}


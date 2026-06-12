let ioInstance;

export function configureSockets(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('join:admins', () => {
      socket.join('admins');
    });
  });
}

export function emitToUser(userId, event, payload) {
  if (ioInstance) ioInstance.to(`user:${userId}`).emit(event, payload);
}

export function emitToAdmins(event, payload) {
  if (ioInstance) ioInstance.to('admins').emit(event, payload);
}

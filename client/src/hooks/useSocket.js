import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext.jsx';

export function useSocket(onNotification) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return undefined;

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.emit('join:user', user.id);
    if (user.role === 'admin') socket.emit('join:admins');
    socket.on('notification:new', onNotification);

    return () => socket.disconnect();
  }, [onNotification, user]);
}

import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL); // Singleton socket

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    return { socket, isConnected };
};

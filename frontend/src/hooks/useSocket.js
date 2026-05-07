import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

// const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('userRole');

        if (!token || !userId) {
            console.log('No token/userId, skipping socket connection');
            return;
        }

        // Create socket connection
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket'],
            auth: { token }
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✅ Socket connected');
            setIsConnected(true);
            
            // Join user to their rooms
            newSocket.emit('join-user', { userId, role: userRole });
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    return { socket, isConnected };
};
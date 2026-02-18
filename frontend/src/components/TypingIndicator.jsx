import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

const TypingIndicator = () => {
    const { socket } = useSocket();
    const [typingUser, setTypingUser] = useState(null);

    useEffect(() => {
        let timeout;

        if (socket) {
            socket.on('user:typing', (data) => {
                setTypingUser(data.user || 'Someone');

                // Clear after 2 seconds of no events
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    setTypingUser(null);
                }, 2000);
            });
        }

        return () => {
            if (socket) socket.off('user:typing');
            clearTimeout(timeout);
        };
    }, [socket]);

    if (!typingUser) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            background: 'var(--text-main)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            opacity: 0.8,
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-in-out'
        }}>
            💬 {typingUser} is typing...
        </div>
    );
};

export default TypingIndicator;

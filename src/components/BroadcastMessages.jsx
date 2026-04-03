import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const BroadcastMessages = () => {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchBroadcastMessages();
        }
    }, [user]);

    const fetchBroadcastMessages = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE_URL}/api/messages`);
            const data = await response.json();

            if (data.success && data.messages) {
                const newMessages = data.messages.filter(msg => {
                    // Only show messages that haven't been seen before
                    const seenMessages = JSON.parse(localStorage.getItem('seenBroadcasts') || '[]');
                    return !seenMessages.includes(msg._id);
                });

                if (newMessages.length > 0) {
                    // Show the latest broadcast message as a notification
                    const latestMessage = newMessages[0];
                    addNotification(`📢 ${latestMessage.text}`, { type: 'info', duration: 10000 });

                    // Mark messages as seen
                    const seenMessages = JSON.parse(localStorage.getItem('seenBroadcasts') || '[]');
                    const updatedSeen = [...seenMessages, ...newMessages.map(m => m._id)];
                    localStorage.setItem('seenBroadcasts', JSON.stringify(updatedSeen));
                }

                setMessages(data.messages.slice(0, 5)); // Keep only latest 5 messages
            }
        } catch (error) {
            console.error('Failed to fetch broadcast messages:', error);
        } finally {
            setLoading(false);
        }
    };

    // Don't render anything if user is not logged in or no messages
    if (!user || messages.length === 0) return null;

    return (
        <div className="broadcast-messages" style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            maxWidth: '300px',
            zIndex: 100,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                📢 Announcements
            </h4>
            {messages.slice(0, 3).map((message, index) => (
                <div key={message._id} style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginBottom: index < messages.length - 1 ? '0.5rem' : 0,
                    paddingBottom: index < messages.length - 1 ? '0.5rem' : 0,
                    borderBottom: index < messages.length - 1 ? '1px solid var(--border-color)' : 'none'
                }}>
                    {message.text}
                </div>
            ))}
        </div>
    );
};

export default BroadcastMessages;
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const ChatWindow = ({ receiver, hotelId, onClose }) => {
    const { user, axios, getToken } = useAppContext();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get(`/api/messages/${receiver._id}?hotelId=${hotelId}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setMessages(data.messages);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (!receiver || !user) return;

        // Fetch past logs
        fetchHistory();

        // Connect Socket.io
        const socket = io(backendUrl);
        socketRef.current = socket;

        // Join personal private room
        socket.emit("join_chat", { userId: user._id });

        // Listen for new incoming messages
        socket.on("receive_message", (message) => {
            // Append message if it belongs to this specific chat context
            const isMatch = message.hotel === hotelId && 
                ((message.sender === user._id && message.receiver === receiver._id) || 
                 (message.sender === receiver._id && message.receiver === user._id));
            if (isMatch) {
                setMessages(prev => {
                    // Prevent duplicates
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [receiver, user, hotelId]);

    // Scroll to bottom on updates
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() || !socketRef.current) return;

        const payload = {
            senderId: user._id,
            receiverId: receiver._id,
            hotelId,
            text: text.trim()
        };

        // Emit message to Socket server
        socketRef.current.emit("send_message", payload);
        setText("");
    };

    if (!receiver) return null;

    return (
        <div className="fixed bottom-5 right-5 w-96 h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col z-[100] font-outfit overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <img 
                        src={receiver.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'} 
                        alt={receiver.username} 
                        className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-sm" 
                    />
                    <div>
                        <p className="font-semibold text-sm leading-tight">{receiver.username}</p>
                        <p className="text-[10px] text-indigo-200 leading-none mt-0.5">Online Support</p>
                    </div>
                </div>
                <button onClick={onClose} className="hover:bg-indigo-700/60 p-1.5 rounded-lg transition-colors cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-8 h-8 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-xs">No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isSelf = msg.sender === user._id;
                        return (
                            <div key={msg._id || index} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                                    isSelf 
                                        ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' 
                                        : 'bg-white text-gray-800 rounded-bl-none shadow-xs border border-gray-100'
                                }`}>
                                    <p>{msg.text}</p>
                                    <p className={`text-[9px] text-right mt-1 ${isSelf ? 'text-indigo-200' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
                <input 
                    type="text" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    placeholder="Type a message..." 
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 outline-indigo-500 text-sm font-light bg-slate-50 focus:bg-white" 
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl shadow cursor-pointer transition-colors shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;

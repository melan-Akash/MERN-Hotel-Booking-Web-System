import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const GuestMessages = () => {
    const { axios, getToken, user } = useAppContext();
    const [guests, setGuests] = useState([]);
    const [hotelId, setHotelId] = useState("");
    const [activeGuest, setActiveGuest] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    const fetchGuests = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/hotels/owner/guests', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setGuests(data.guests || []);
                setHotelId(data.hotelId || "");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchChatHistory = async (guestId) => {
        try {
            const { data } = await axios.get(`/api/messages/${guestId}?hotelId=${hotelId}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setMessages(data.messages || []);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    useEffect(() => {
        if (!activeGuest || !user) return;

        fetchChatHistory(activeGuest._id);

        const socket = io(backendUrl);
        socketRef.current = socket;

        socket.emit("join_chat", { userId: user._id });

        socket.on("receive_message", (message) => {
            const isMatch = message.hotel === hotelId && 
                ((message.sender === user._id && message.receiver === activeGuest._id) || 
                 (message.sender === activeGuest._id && message.receiver === user._id));
            if (isMatch) {
                setMessages(prev => {
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [activeGuest, user, hotelId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() || !socketRef.current || !activeGuest) return;

        const payload = {
            senderId: user._id,
            receiverId: activeGuest._id,
            hotelId,
            text: text.trim()
        };

        socketRef.current.emit("send_message", payload);
        setText("");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 border-r-2" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto h-[600px] font-outfit">
            
            {/* Left Column: Guest list */}
            <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm h-full flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 px-2 pb-3 border-b border-slate-100 shrink-0">Guest Bookings Chats</h3>
                <div className="space-y-2 mt-4 flex-1 overflow-y-auto pr-1">
                    {guests.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-10 font-light">No guest chat channels active.</p>
                    ) : (
                        guests.map((guest) => (
                            <div
                                key={guest._id}
                                onClick={() => setActiveGuest(guest)}
                                className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${
                                    activeGuest?._id === guest._id
                                        ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900 shadow-sm'
                                        : 'border-transparent hover:bg-slate-50 text-gray-700'
                                }`}
                            >
                                <img src={guest.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'} alt={guest.username} className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-sm truncate">{guest.username}</p>
                                    <p className="text-xs text-gray-400 truncate">{guest.email}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Column: Chat body */}
            <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
                {activeGuest ? (
                    <div className="flex flex-col h-full">
                        {/* Chat Header */}
                        <div className="p-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between shadow-xs shrink-0">
                            <div className="flex items-center gap-3">
                                <img src={activeGuest.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'} alt={activeGuest.username} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200" />
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">{activeGuest.username}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Booking.com Live Guest Channel</p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages Log */}
                        <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <p className="text-sm font-light">Start conversation with {activeGuest.username}.</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isSelf = msg.sender === user._id;
                                    return (
                                        <div key={msg._id || index} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                                isSelf 
                                                    ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' 
                                                    : 'bg-white text-gray-800 rounded-bl-none shadow-xs border border-gray-150'
                                            }`}>
                                                <p>{msg.text}</p>
                                                <p className={`text-[9px] text-right mt-1.5 ${isSelf ? 'text-indigo-200' : 'text-gray-400 font-light'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat footer text input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-3 shrink-0">
                            <input 
                                type="text" 
                                value={text} 
                                onChange={(e) => setText(e.target.value)} 
                                placeholder={`Type message to ${activeGuest.username}...`} 
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 outline-indigo-500 text-sm font-light bg-slate-50 focus:bg-white" 
                            />
                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl shadow cursor-pointer transition-colors shrink-0 text-sm font-semibold flex items-center justify-center">
                                Send
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-500">No Chat Channel Selected</p>
                        <p className="text-sm text-gray-400 mt-1">Select a guest from the left sidebar to start live chatting.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default GuestMessages;

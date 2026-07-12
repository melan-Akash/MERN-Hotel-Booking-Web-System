import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const PricingCalendar = () => {
    const { axios, getToken, currency } = useAppContext();
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [roomPricing, setRoomPricing] = useState({ pricePerNight: 0, priceOverrides: [] });
    const [loading, setLoading] = useState(true);

    // Calendar navigation states
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateStr, setSelectedDateStr] = useState(null);
    const [overridePrice, setOverridePrice] = useState("");
    const [showModal, setShowModal] = useState(false);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/rooms/owner', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setRooms(data.rooms || []);
                if (data.rooms.length > 0) {
                    setSelectedRoomId(data.rooms[0]._id);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchPricing = async (roomId) => {
        if (!roomId) return;
        try {
            const { data } = await axios.get(`/api/rooms/${roomId}/pricing`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setRoomPricing({
                    pricePerNight: data.pricePerNight,
                    priceOverrides: data.priceOverrides || []
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        if (selectedRoomId) {
            fetchPricing(selectedRoomId);
        }
    }, [selectedRoomId]);

    const handleSaveOverride = async (e) => {
        e.preventDefault();
        try {
            const priceVal = overridePrice === "" ? null : Number(overridePrice);
            const { data } = await axios.post(`/api/rooms/${selectedRoomId}/pricing`, {
                date: selectedDateStr,
                price: priceVal
            }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                toast.success(data.message);
                setRoomPricing(prev => ({
                    ...prev,
                    priceOverrides: data.priceOverrides
                }));
                setShowModal(false);
                setOverridePrice("");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Calendar calculations
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDateClick = (day) => {
        const d = new Date(year, month, day);
        // format as local YYYY-MM-DD to match database overrides
        const offset = d.getTimezoneOffset();
        const adjustedDate = new Date(d.getTime() - (offset*60*1000));
        const dateStr = adjustedDate.toISOString().split('T')[0];

        setSelectedDateStr(dateStr);
        
        // Find existing override price
        const override = roomPricing.priceOverrides.find(o => o.date === dateStr);
        setOverridePrice(override ? override.price : "");
        setShowModal(true);
    };

    const getDayPrice = (day) => {
        const d = new Date(year, month, day);
        const offset = d.getTimezoneOffset();
        const adjustedDate = new Date(d.getTime() - (offset*60*1000));
        const dateStr = adjustedDate.toISOString().split('T')[0];

        const override = roomPricing.priceOverrides.find(o => o.date === dateStr);
        return override ? override.price : roomPricing.pricePerNight;
    };

    const isDayOverridden = (day) => {
        const d = new Date(year, month, day);
        const offset = d.getTimezoneOffset();
        const adjustedDate = new Date(d.getTime() - (offset*60*1000));
        const dateStr = adjustedDate.toISOString().split('T')[0];

        return roomPricing.priceOverrides.some(o => o.date === dateStr);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 border-r-2" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm font-outfit relative">
            <h2 className="font-playfair text-2xl font-bold text-gray-800 border-b border-slate-100 pb-3">Dynamic Pricing Calendar</h2>
            
            {/* Select Room */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Select Room Listings</label>
                <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 outline-indigo-500 text-sm font-light bg-slate-50 focus:bg-white"
                >
                    {rooms.map(room => (
                        <option key={room._id} value={room._id}>
                            {room.roomType} (Base: {currency}{room.pricePerNight}/night)
                        </option>
                    ))}
                </select>
            </div>

            {/* Calendar Widget */}
            {selectedRoomId ? (
                <div className="mt-8 border border-gray-200 rounded-2xl overflow-hidden bg-slate-50 shadow-xs">
                    {/* Month selector header */}
                    <div className="flex items-center justify-between p-4 bg-indigo-600 text-white">
                        <button onClick={prevMonth} className="hover:bg-indigo-700 p-1.5 rounded-lg cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h3 className="font-semibold text-base md:text-lg">{monthNames[month]} {year}</h3>
                        <button onClick={nextMonth} className="hover:bg-indigo-700 p-1.5 rounded-lg cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Weekdays */}
                    <div className="grid grid-cols-7 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider py-3 border-b border-gray-200 bg-white">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-px bg-gray-200">
                        {/* Empty spacer cells */}
                        {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="bg-slate-50 min-h-[80px]" />
                        ))}

                        {/* Calendar days */}
                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                            const day = idx + 1;
                            const isOverridden = isDayOverridden(day);
                            const dayPrice = getDayPrice(day);
                            return (
                                <div
                                    key={`day-${day}`}
                                    onClick={() => handleDateClick(day)}
                                    className={`bg-white min-h-[80px] p-2 flex flex-col justify-between hover:bg-indigo-50/40 cursor-pointer transition-all border border-transparent hover:border-indigo-200 relative ${
                                        isOverridden ? 'bg-amber-50/40' : ''
                                    }`}
                                >
                                    <span className={`text-xs font-semibold ${isOverridden ? 'text-amber-800' : 'text-gray-500'}`}>{day}</span>
                                    <span className={`text-xs font-bold mt-2 text-right ${
                                        isOverridden ? 'text-indigo-600 font-extrabold' : 'text-gray-700 font-light'
                                    }`}>
                                        {currency}{dayPrice}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="mt-10 p-10 bg-slate-50 border border-dashed border-gray-200 text-center text-gray-400 rounded-2xl">
                    Please create a Room Listing first to configure dynamic pricing.
                </div>
            )}

            {/* Price Edit Modal Popup */}
            {showModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl font-outfit border border-gray-200">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <h4 className="font-semibold text-lg text-gray-800">Set Date Price</h4>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSaveOverride} className="mt-4 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Target Date</label>
                                <p className="text-sm font-semibold text-gray-700 mt-1">{new Date(selectedDateStr).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Default Room Price</label>
                                <p className="text-sm text-gray-600 mt-0.5">{currency}{roomPricing.pricePerNight} / night</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Custom Date Price ({currency})</label>
                                <input
                                    type="number"
                                    value={overridePrice}
                                    onChange={(e) => setOverridePrice(e.target.value)}
                                    placeholder={`e.g. 150 (Leave blank to revert to base)`}
                                    className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 text-sm font-light"
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow transition-colors cursor-pointer"
                                >
                                    Save Override
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PricingCalendar;

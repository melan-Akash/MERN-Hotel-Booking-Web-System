import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageBookings = () => {
    const { axios, getToken, currency } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/bookings/hotel', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setBookings(data.dashboardData.bookings || []);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            const { data } = await axios.post('/api/bookings/update-status', {
                bookingId,
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                toast.success(data.message);
                fetchBookings(); // refresh
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 border-r-2" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm font-outfit">
            <h2 className="font-playfair text-2xl font-bold text-gray-800 border-b border-slate-100 pb-3">Manage Hotel Bookings</h2>
            
            <div className="overflow-x-auto mt-6 rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-slate-55">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Guest</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Room Type</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Check-in / Out</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Price</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Payment</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 bg-white">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-gray-400 font-light">
                                    No bookings logged for this hotel.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={booking.user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'} 
                                                alt="avatar" 
                                                className="w-8 h-8 rounded-full object-cover shadow-xs border border-gray-100" 
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{booking.user?.username || 'Guest'}</p>
                                                <p className="text-xs text-gray-400">{booking.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-light">
                                        {booking.room?.roomType}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 font-light leading-relaxed">
                                        <div>In: <span className="font-semibold text-gray-700">{new Date(booking.checkInDate).toLocaleDateString()}</span></div>
                                        <div>Out: <span className="font-semibold text-gray-700">{new Date(booking.checkOutDate).toLocaleDateString()}</span></div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                        {currency}{booking.totalPrice}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${
                                            booking.isPaid 
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                                        }`}>
                                            {booking.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={booking.status}
                                            onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors outline-indigo-500 cursor-pointer ${
                                                booking.status === 'confirmed' ? 'bg-emerald-55 border-emerald-200 text-emerald-800' :
                                                booking.status === 'checked-in' ? 'bg-blue-55 border-blue-200 text-blue-800' :
                                                booking.status === 'checked-out' ? 'bg-purple-55 border-purple-200 text-purple-800' :
                                                booking.status === 'cancelled' ? 'bg-red-55 border-red-200 text-red-800' :
                                                'bg-amber-55 border-amber-200 text-amber-800'
                                            }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="checked-in">Checked-in</option>
                                            <option value="checked-out">Checked-out</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBookings;

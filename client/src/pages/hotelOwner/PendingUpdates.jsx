import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const PendingUpdates = () => {
    const { axios, getToken } = useAppContext();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeHotel, setActiveHotel] = useState(null);

    const fetchPendingUpdates = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/admin/pending-updates', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setHotels(data.hotels);
                if (data.hotels.length > 0) {
                    setActiveHotel(data.hotels[0]);
                } else {
                    setActiveHotel(null);
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

    useEffect(() => {
        fetchPendingUpdates();
    }, []);

    const handleApproval = async (hotelId, approve) => {
        try {
            const url = approve ? '/api/admin/approve-update' : '/api/admin/reject-update';
            const { data } = await axios.post(url, { hotelId }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                toast.success(data.message);
                fetchPendingUpdates();
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

    if (hotels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 font-outfit">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-lg font-medium">No pending hotel updates to review</p>
                <p className="text-sm text-gray-400 mt-1">All updates are currently approved or rejected.</p>
            </div>
        );
    }

    const ComparisonRow = ({ label, current, pending }) => {
        const isChanged = JSON.stringify(current) !== JSON.stringify(pending);
        return (
            <tr className={`border-b border-gray-150 transition-colors ${isChanged ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50'}`}>
                <td className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</td>
                <td className="px-6 py-4 text-sm text-gray-700 leading-relaxed break-words max-w-xs">{Array.isArray(current) ? current.join(', ') : current}</td>
                <td className={`px-6 py-4 text-sm font-medium leading-relaxed break-words max-w-xs ${isChanged ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                    {Array.isArray(pending) ? pending.join(', ') : pending}
                </td>
            </tr>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto font-outfit">
            
            {/* Left side: Hotels list */}
            <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm h-fit">
                <h3 className="text-lg font-bold text-gray-800 px-2 pb-3 border-b border-slate-100">Hotels Review List</h3>
                <div className="space-y-2 mt-4 max-h-[60vh] overflow-y-auto pr-1">
                    {hotels.map((hotel) => (
                        <div
                            key={hotel._id}
                            onClick={() => setActiveHotel(hotel)}
                            className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${
                                activeHotel?._id === hotel._id
                                    ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900 shadow-sm'
                                    : 'border-transparent hover:bg-slate-50 text-gray-700'
                            }`}
                        >
                            <img src={hotel.coverImage} alt={hotel.name} className="w-12 h-12 rounded-lg object-cover shadow-sm shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm truncate">{hotel.name}</p>
                                <p className="text-xs text-gray-400 truncate">{hotel.city}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side: Side-by-side comparison */}
            {activeHotel && (
                <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    
                    {/* Header */}
                    <div className="p-6 bg-slate-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">Review Update Request</span>
                            <h3 className="font-playfair text-2xl font-bold text-gray-800 mt-2">{activeHotel.name}</h3>
                            <p className="text-xs text-gray-400 mt-1">Submitted by Owner: {activeHotel.owner?.username || activeHotel.owner?.email}</p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <button
                                onClick={() => handleApproval(activeHotel._id, false)}
                                className="px-5 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleApproval(activeHotel._id, true)}
                                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow transition-colors cursor-pointer"
                            >
                                Approve
                            </button>
                        </div>
                    </div>

                    {/* Table Comparative View */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-fixed">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Field</th>
                                    <th className="w-3/8 px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Live Value</th>
                                    <th className="w-3/8 px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested New Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                <ComparisonRow label="Hotel Name" current={activeHotel.name} pending={activeHotel.pendingUpdates.name} />
                                <ComparisonRow label="Phone" current={activeHotel.contact} pending={activeHotel.pendingUpdates.contact} />
                                <ComparisonRow label="Property Type" current={activeHotel.propertyType} pending={activeHotel.pendingUpdates.propertyType} />
                                <ComparisonRow label="City" current={activeHotel.city} pending={activeHotel.pendingUpdates.city} />
                                <ComparisonRow label="Address" current={activeHotel.address} pending={activeHotel.pendingUpdates.address} />
                                <ComparisonRow label="Description" current={activeHotel.description} pending={activeHotel.pendingUpdates.description} />
                                <ComparisonRow label="Star Rating" current={`${activeHotel.starRating} Stars`} pending={`${activeHotel.pendingUpdates.starRating} Stars`} />
                                <ComparisonRow label="Check-in Policy" current={activeHotel.policies?.checkInTime} pending={activeHotel.pendingUpdates.policies?.checkInTime} />
                                <ComparisonRow label="Check-out Policy" current={activeHotel.policies?.checkOutTime} pending={activeHotel.pendingUpdates.policies?.checkOutTime} />
                                <ComparisonRow label="Amenities" current={activeHotel.hotelAmenities} pending={activeHotel.pendingUpdates.hotelAmenities} />
                                
                                {/* Image row */}
                                <tr className="border-b border-gray-150 hover:bg-slate-50">
                                    <td className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cover Image</td>
                                    <td className="px-6 py-4">
                                        <img src={activeHotel.coverImage} alt="Current" className="w-full max-h-36 rounded-lg object-cover border border-gray-200" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <img src={activeHotel.pendingUpdates.coverImage} alt="Pending" className="w-full max-h-36 rounded-lg object-cover border border-indigo-200" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
        </div>
    );
};

export default PendingUpdates;

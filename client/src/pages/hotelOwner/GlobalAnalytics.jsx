import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const GlobalAnalytics = () => {
    const { axios, getToken, currency } = useAppContext();
    const [analytics, setAnalytics] = useState({ totalUsers: 0, totalHotels: 0, totalRevenue: 0 });
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/admin/analytics', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setAnalytics(data.analytics);
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
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 border-r-2" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm font-outfit">
            <h2 className="font-playfair text-2xl font-bold text-gray-800 border-b border-slate-100 pb-3">Global Platform Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Total Revenue */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 flex items-center gap-4 hover:shadow-xs transition-shadow">
                    <div className="p-3 bg-indigo-600 rounded-xl text-white shrink-0">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{currency}{analytics.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                {/* Total Users */}
                <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-6 flex items-center gap-4 hover:shadow-xs transition-shadow">
                    <div className="p-3 bg-sky-600 rounded-xl text-white shrink-0">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Platform Users</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{analytics.totalUsers.toLocaleString()}</p>
                    </div>
                </div>

                {/* Registered Hotels */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 flex items-center gap-4 hover:shadow-xs transition-shadow">
                    <div className="p-3 bg-emerald-600 rounded-xl text-white shrink-0">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Hotels</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{analytics.totalHotels.toLocaleString()}</p>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default GlobalAnalytics;

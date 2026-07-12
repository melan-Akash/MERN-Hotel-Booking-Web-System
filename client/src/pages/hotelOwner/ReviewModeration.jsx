import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ReviewModeration = () => {
    const { axios, getToken } = useAppContext();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/admin/reviews', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setReviews(data.reviews || []);
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
        fetchReviews();
    }, []);

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this guest review? This action is permanent.")) return;

        try {
            const { data } = await axios.delete(`/api/admin/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                toast.success(data.message);
                fetchReviews(); // refresh
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
            <h2 className="font-playfair text-2xl font-bold text-gray-800 border-b border-slate-100 pb-3">Guest Review Moderation Console</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {reviews.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-gray-400 font-light">
                        No guest reviews logged on the platform yet.
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-slate-50 border border-gray-150 rounded-2xl p-5 hover:shadow-xs transition-shadow flex flex-col justify-between">
                            <div>
                                {/* Header (Hotel, rating stars) */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-800">{review.hotel?.name || 'Hotel Listing'}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{review.hotel?.city}</p>
                                    </div>
                                    <div className="flex gap-0.5 text-amber-400">
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <svg 
                                                key={idx} 
                                                className={`w-4.5 h-4.5 ${idx < review.rating ? 'fill-current' : 'text-gray-300'}`} 
                                                viewBox="0 0 20 20" 
                                                fill="currentColor"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>

                                {/* Review content */}
                                <p className="text-sm font-light text-gray-600 italic mt-3 leading-relaxed">
                                    "{review.comment}"
                                </p>
                            </div>

                            {/* Footer (User, deletion control) */}
                            <div className="flex items-center justify-between border-t border-slate-200/60 pt-3.5 mt-4 shrink-0">
                                <div className="text-xs">
                                    <p className="font-semibold text-gray-700">By: {review.user?.username || 'Guest'}</p>
                                    <p className="text-gray-400 mt-0.5">{review.user?.email}</p>
                                </div>
                                <button 
                                    onClick={() => handleDeleteReview(review._id)}
                                    className="px-3.5 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                                >
                                    Delete Review
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewModeration;

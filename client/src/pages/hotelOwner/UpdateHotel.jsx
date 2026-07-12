import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { cities } from '../../assets/assets';

const UpdateHotel = () => {
    const { axios, getToken } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [hasPendingUpdate, setHasPendingUpdate] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [city, setCity] = useState("");
    const [description, setDescription] = useState("");
    const [propertyType, setPropertyType] = useState("Hotel");
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [hotelAmenities, setHotelAmenities] = useState([]);
    const [starRating, setStarRating] = useState(5);
    const [checkInTime, setCheckInTime] = useState("14:00");
    const [checkOutTime, setCheckOutTime] = useState("12:00");

    const amenitiesList = ['Parking', 'Restaurant', 'Spa', 'Gym', 'Pool'];

    const fetchHotelData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/hotels/owner', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            
            if (data.success && data.hotel) {
                const hotel = data.hotel;
                setName(hotel.name || "");
                setAddress(hotel.address || "");
                setContact(hotel.contact || "");
                setCity(hotel.city || "");
                setDescription(hotel.description || "");
                setPropertyType(hotel.propertyType || "Hotel");
                setCoverImagePreview(hotel.coverImage || null);
                setHotelAmenities(hotel.hotelAmenities || []);
                setStarRating(hotel.starRating || 5);
                setCheckInTime(hotel.policies?.checkInTime || "14:00");
                setCheckOutTime(hotel.policies?.checkOutTime || "12:00");
                
                if (hotel.pendingUpdates) {
                    setHasPendingUpdate(true);
                    const pending = hotel.pendingUpdates;
                    setName(pending.name || "");
                    setAddress(pending.address || "");
                    setContact(pending.contact || "");
                    setCity(pending.city || "");
                    setDescription(pending.description || "");
                    setPropertyType(pending.propertyType || "Hotel");
                    setCoverImagePreview(pending.coverImage || null);
                    setHotelAmenities(pending.hotelAmenities || []);
                    setStarRating(pending.starRating || 5);
                    setCheckInTime(pending.policies?.checkInTime || "14:00");
                    setCheckOutTime(pending.policies?.checkOutTime || "12:00");
                } else {
                    setHasPendingUpdate(false);
                }
            } else {
                toast.error(data.message || "Failed to load hotel details.");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotelData();
    }, []);

    const handleAmenityChange = (amenity) => {
        if (hasPendingUpdate) return;
        setHotelAmenities(prev => 
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
    };

    const handleImageChange = (e) => {
        if (hasPendingUpdate) return;
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (hasPendingUpdate) return;

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("contact", contact);
            formData.append("address", address);
            formData.append("city", city);
            formData.append("description", description);
            formData.append("propertyType", propertyType);
            formData.append("starRating", starRating);
            formData.append("checkInTime", checkInTime);
            formData.append("checkOutTime", checkOutTime);
            if (coverImage) {
                formData.append("coverImage", coverImage);
            }
            formData.append("hotelAmenities", JSON.stringify(hotelAmenities));

            const { data } = await axios.post('/api/hotels/update-request', formData, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            if (data.success) {
                toast.success(data.message);
                setHasPendingUpdate(true);
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
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm relative font-outfit">
            
            {hasPendingUpdate && (
                <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-center gap-3 animate-pulse-slow">
                    <svg className="w-6 h-6 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-sm">Your previous update is pending Admin approval.</p>
                        <p className="text-xs text-amber-700 mt-0.5">You cannot make any changes or submit new updates until the admin reviews your pending request.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: Image Selector */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3 w-full text-left">Cover Image</label>
                    <div className="relative w-full h-56 rounded-xl border border-gray-200 overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner group">
                        {coverImagePreview ? (
                            <img src={coverImagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-gray-400">No Image Uploaded</span>
                        )}
                        {!hasPendingUpdate && (
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity text-xs font-medium backdrop-blur-xs">
                                Change Image
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Right Column: Form Inputs */}
                <div className="w-full md:w-2/3">
                    <h2 className="font-playfair text-2xl font-bold text-gray-800 border-b border-slate-100 pb-3">Update Hotel Details</h2>
                    
                    <form onSubmit={onSubmitHandler} className="space-y-5 mt-6">
                        
                        {/* Name */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hotel Name</label>
                            <input 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={hasPendingUpdate}
                                className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 text-sm font-light disabled:bg-slate-100 disabled:text-gray-400 transition-colors"
                                type="text"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Phone */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Contact</label>
                                <input 
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    disabled={hasPendingUpdate}
                                    className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 text-sm font-light disabled:bg-slate-100 disabled:text-gray-400 transition-colors"
                                    type="text"
                                    required
                                />
                            </div>

                            {/* Property Type */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Property Type</label>
                                <select 
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    disabled={hasPendingUpdate}
                                    className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 text-sm font-light disabled:bg-slate-100 disabled:text-gray-400 transition-colors"
                                    required
                                >
                                    <option value="Hotel">Hotel</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Resort">Resort</option>
                                    <option value="Guest House">Guest House</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                            <textarea 
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={hasPendingUpdate}
                                className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 text-sm font-light disabled:bg-slate-100 disabled:text-gray-400 transition-colors resize-none"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</label>
                            <textarea 
                                rows="2"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                disabled={hasPendingUpdate}
                                className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 text-sm font-light disabled:bg-slate-100 disabled:text-gray-400 transition-colors resize-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* City Drop Down */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City</label>
                                <select 
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    disabled={hasPendingUpdate}
                                    className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 text-sm font-light disabled:bg-slate-100 disabled:text-gray-400 transition-colors"
                                    required
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Star Rating Drop Down */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Star Rating</label>
                                <select 
                                    value={starRating}
                                    onChange={(e) => setStarRating(Number(e.target.value))}
                                    disabled={hasPendingUpdate}
                                    className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 text-sm font-light disabled:bg-slate-100 disabled:text-gray-400 transition-colors"
                                    required
                                >
                                    {[5, 4, 3, 2, 1].map((stars) => (
                                        <option key={stars} value={stars}>{stars} Star{stars > 1 && 's'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Policies Section */}
                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Policies</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400">Check-in Time</label>
                                    <input 
                                        type="time" 
                                        value={checkInTime} 
                                        onChange={(e) => setCheckInTime(e.target.value)} 
                                        disabled={hasPendingUpdate}
                                        className="border border-gray-200 rounded-lg w-full px-3 py-1.5 mt-1 outline-indigo-500 text-sm font-light disabled:bg-slate-100 disabled:text-gray-400" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Check-out Time</label>
                                    <input 
                                        type="time" 
                                        value={checkOutTime} 
                                        onChange={(e) => setCheckOutTime(e.target.value)} 
                                        disabled={hasPendingUpdate}
                                        className="border border-gray-200 rounded-lg w-full px-3 py-1.5 mt-1 outline-indigo-500 text-sm font-light disabled:bg-slate-100 disabled:text-gray-400" 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Amenities</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                {amenitiesList.map((amenity) => (
                                    <label key={amenity} className="flex gap-2 items-center cursor-pointer text-sm font-light text-gray-600 select-none">
                                        <input 
                                            type="checkbox" 
                                            checked={hotelAmenities.includes(amenity)} 
                                            onChange={() => handleAmenityChange(amenity)}
                                            disabled={hasPendingUpdate}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                                        />
                                        <span>{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={hasPendingUpdate}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-lg shadow cursor-pointer transition-all hover:shadow-md w-full disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed mt-6"
                        >
                            Request Update Approval
                        </button>

                    </form>
                </div>
            </div>

        </div>
    );
};

export default UpdateHotel;

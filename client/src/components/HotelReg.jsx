import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { assets, cities } from "../assets/assets";

const HotelReg = () => {
    const { setShowHotelReg, axios, getToken } = useAppContext();

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [city, setCity] = useState("");
    
    // New Upgraded Fields
    const [description, setDescription] = useState("");
    const [propertyType, setPropertyType] = useState("Hotel");
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [hotelAmenities, setHotelAmenities] = useState([]);
    const [starRating, setStarRating] = useState(5);
    const [checkInTime, setCheckInTime] = useState("14:00");
    const [checkOutTime, setCheckOutTime] = useState("12:00");

    const amenitiesList = ['Parking', 'Restaurant', 'Spa', 'Gym', 'Pool'];

    const handleAmenityChange = (amenity) => {
        setHotelAmenities(prev => 
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            if (!coverImage) {
                toast.error("Please upload a cover image.");
                return;
            }

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
            formData.append("coverImage", coverImage);
            formData.append("hotelAmenities", JSON.stringify(hotelAmenities));

            const { data } = await axios.post(`/api/hotels/`, formData, { 
                headers: { 
                    Authorization: `Bearer ${await getToken()}`,
                    "Content-Type": "multipart/form-data"
                } 
            });

            if (data.success) {
                toast.success(data.message);
                setShowHotelReg(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div onClick={() => setShowHotelReg(false)} className="fixed inset-0 z-[150] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <form 
                onSubmit={onSubmitHandler} 
                onClick={(e) => e.stopPropagation()} 
                className="flex flex-col md:flex-row bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn"
            >
                {/* Left Side: Illustrative / Image Preview */}
                <div className="md:w-2/5 bg-slate-900 text-white p-8 md:p-10 flex flex-col justify-between rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none min-h-[260px] md:min-h-full relative overflow-hidden">
                    {coverImagePreview ? (
                        <div className="absolute inset-0 z-0">
                            <img src={coverImagePreview} alt="Cover Preview" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 z-0">
                            <img src={assets.regImage} alt="Reg Cover" className="w-full h-full object-cover opacity-45" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                        </div>
                    )}
                    
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <p className="text-sm font-semibold tracking-wider text-sky-400 uppercase">Partner Program</p>
                            <h2 className="font-playfair text-3xl font-bold mt-2">List Your Property</h2>
                            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                                Join our global network of hotels and host travelers looking for unique stays.
                            </p>
                        </div>
                        {coverImagePreview && (
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl mt-6">
                                <p className="text-xs text-sky-300 uppercase font-semibold">Live Preview</p>
                                <p className="text-lg font-playfair font-bold mt-1 truncate">{name || "Your Hotel Name"}</p>
                                <p className="text-xs text-slate-300 mt-0.5 truncate">{city ? `${city}, Sri Lanka` : "City Not Specified"}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Form Inputs */}
                <div className="relative flex flex-col md:w-3/5 p-8 md:p-10 bg-white">
                    <img 
                        src={assets.closeIcon} 
                        alt="close-icon" 
                        className="absolute top-5 right-5 h-4 w-4 cursor-pointer hover:scale-110 transition-transform" 
                        onClick={() => setShowHotelReg(false)} 
                    />
                    
                    <p className="text-2xl font-bold text-gray-800 border-b border-slate-100 pb-3 font-playfair">Hotel Information</p>
                    
                    <div className="space-y-5 mt-6">
                        {/* Hotel Name */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hotel Name</label>
                            <input 
                                onChange={(e) => setName(e.target.value)} 
                                value={name} 
                                placeholder="e.g. Grand Hilton Suites" 
                                className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 font-light text-sm bg-slate-50 focus:bg-white transition-colors" 
                                type="text" 
                                required 
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Phone */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Contact</label>
                                <input 
                                    onChange={(e) => setContact(e.target.value)} 
                                    value={contact} 
                                    placeholder="e.g. +94 77 123 4567" 
                                    className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 font-light text-sm bg-slate-50 focus:bg-white transition-colors" 
                                    type="text" 
                                    required 
                                />
                            </div>

                            {/* Property Type Selection */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Property Type</label>
                                <select 
                                    onChange={(e) => setPropertyType(e.target.value)} 
                                    value={propertyType} 
                                    className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 font-light text-sm bg-slate-50 focus:bg-white transition-colors" 
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
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Property Description</label>
                            <textarea 
                                rows="3" 
                                onChange={(e) => setDescription(e.target.value)} 
                                value={description} 
                                placeholder="Describe the ambiance, style, and what makes your stay special..." 
                                className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 font-light text-sm bg-slate-50 focus:bg-white transition-colors resize-none" 
                                required 
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Physical Address</label>
                            <textarea 
                                rows="2" 
                                onChange={(e) => setAddress(e.target.value)} 
                                value={address} 
                                placeholder="e.g. 123 Ocean Drive, Galle Road" 
                                className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 font-light text-sm bg-slate-50 focus:bg-white transition-colors resize-none" 
                                required 
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* City Drop Down */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City</label>
                                <select 
                                    onChange={(e) => setCity(e.target.value)} 
                                    value={city} 
                                    className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 font-light text-sm bg-slate-50 focus:bg-white transition-colors" 
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
                                    onChange={(e) => setStarRating(Number(e.target.value))} 
                                    value={starRating} 
                                    className="border border-gray-200 rounded-lg w-full px-3 py-2 mt-1.5 outline-indigo-500 font-light text-sm bg-slate-50 focus:bg-white transition-colors" 
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
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2.5">Check-In & Check-Out Policies</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400">Check-in Time</label>
                                    <input 
                                        type="time" 
                                        value={checkInTime} 
                                        onChange={(e) => setCheckInTime(e.target.value)} 
                                        className="border border-gray-200 rounded-lg w-full px-3 py-1.5 mt-1 outline-indigo-500 font-light text-sm bg-slate-50 focus:bg-white" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400">Check-out Time</label>
                                    <input 
                                        type="time" 
                                        value={checkOutTime} 
                                        onChange={(e) => setCheckOutTime(e.target.value)} 
                                        className="border border-gray-200 rounded-lg w-full px-3 py-1.5 mt-1 outline-indigo-500 font-light text-sm bg-slate-50 focus:bg-white" 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Amenities Checkboxes */}
                        <div className="border-t border-slate-100 pt-4">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Amenities Offered</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                {amenitiesList.map((amenity) => (
                                    <label key={amenity} className="flex gap-2 items-center cursor-pointer text-sm font-light text-gray-600 select-none">
                                        <input 
                                            type="checkbox" 
                                            checked={hotelAmenities.includes(amenity)} 
                                            onChange={() => handleAmenityChange(amenity)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span>{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* File Selector Cover Image */}
                        <div className="border-t border-slate-100 pt-4">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Upload Cover Image</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-gray-300 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-6 h-6 mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-xs text-gray-500"><span className="font-semibold text-indigo-500">Click to upload</span> cover image</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG or WEBP up to 5MB</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-lg shadow cursor-pointer transition-all hover:shadow-md mt-8 w-full">
                        Submit Registration
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HotelReg;

import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Navbar = () => {
    const { user, logout, navigate } = useAppContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Close dropdown on click outside
    useEffect(() => {
        const handleOutsideClick = () => {
            setIsDropdownOpen(false);
        };
        if (isDropdownOpen) {
            window.addEventListener('click', handleOutsideClick);
        }
        return () => window.removeEventListener('click', handleOutsideClick);
    }, [isDropdownOpen]);

    return (
        <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300 font-outfit relative">
            <Link to="/">
                <img className="h-9 invert opacity-80" src={assets.logo} alt="logo" />
            </Link>
            
            {user && (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                        className="flex items-center gap-2 cursor-pointer focus:outline-none"
                    >
                        <img 
                            src={user.image || assets.userIcon} 
                            alt="profile" 
                            className="h-8 w-8 rounded-full border border-slate-200 object-cover hover:ring-2 hover:ring-primary/50 transition-all"
                        />
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                            {user.username}
                        </span>
                    </button>
                    
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 text-gray-700 z-50 animate-fade-in font-outfit">
                            <div className="px-4 py-2 border-b border-slate-100">
                                <p className="font-semibold text-xs text-slate-800 truncate">{user.username}</p>
                                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    navigate('/');
                                }} 
                                className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                            >
                                Back to Site
                            </button>
                            <button 
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    logout();
                                }} 
                                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Navbar
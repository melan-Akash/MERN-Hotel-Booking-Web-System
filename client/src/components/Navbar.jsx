import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const BookIcon = () => (
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
    </svg>
);

const Navbar = () => {

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/' },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();

    const { user, setShowHotelReg, isOwner, navigate, logout } = useAppContext()

    useEffect(() => {
        if (location.pathname !== "/") {
            setIsScrolled(true);
            return;
        } else {
            setIsScrolled(false);
        }

        setIsScrolled(prev => location.pathname !== "/" ? true : prev);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

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
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>
            <Link to="/">
                <img src={assets.logo} alt="logo" className={`h-9 ${isScrolled && "invert opacity-80"}`} />
            </Link>

            <div className="hidden md:flex items-center gap-4 lg:gap-8 font-outfit">
                {navLinks.map((navLink, index) => (
                    <NavLink key={index} to={navLink.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`} onClick={() => scrollTo(0, 0)}>
                        {navLink.name}
                        <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} ></div>
                    </NavLink>
                ))}
                {
                    user && (
                        <button className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`} onClick={() => isOwner ? navigate('/owner') : setShowHotelReg(true)}>
                            {isOwner ? 'Dashboard' : 'List Your Hotel'}
                        </button>
                    )
                }
            </div>

            <div className="hidden md:flex items-center gap-4 relative font-outfit">
                <img src={assets.searchIcon} alt="search" className={`${isScrolled && "invert"} h-7 transition-all duration-500`} />
                {user ? (
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
                            <span className={`text-sm font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                                {user.username}
                            </span>
                        </button>
                        
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 text-gray-700 z-50 animate-fade-in font-outfit">
                                <div className="px-4 py-2.5 border-b border-slate-100">
                                    <p className="font-semibold text-sm text-slate-800 truncate">{user.username}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        navigate('/my-bookings');
                                    }} 
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                    <BookIcon />
                                    My Bookings
                                </button>
                                {isOwner ? (
                                    <button 
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            navigate('/owner');
                                        }} 
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-11.25 0v-2.25" />
                                        </svg>
                                        Dashboard
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setShowHotelReg(true);
                                        }} 
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        List Your Hotel
                                    </button>
                                )}
                                <div className="border-t border-slate-100 my-1"></div>
                                <button 
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        logout();
                                    }} 
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500 cursor-pointer hover:bg-slate-900 shadow-md">
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu */}
            <div className="flex items-center gap-3 md:hidden font-outfit">
                {user ? (
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <img 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                            src={user.image || assets.userIcon} 
                            alt="profile" 
                            className="h-8 w-8 rounded-full border border-slate-200 cursor-pointer object-cover"
                        />
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 text-gray-700 z-50 font-outfit">
                                <div className="px-3.5 py-1.5 border-b border-slate-100">
                                    <p className="font-semibold text-xs text-slate-800 truncate">{user.username}</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        navigate('/my-bookings');
                                    }} 
                                    className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                    My Bookings
                                </button>
                                {isOwner ? (
                                    <button 
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            navigate('/owner');
                                        }} 
                                        className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                                    >
                                        Dashboard
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setShowHotelReg(true);
                                        }} 
                                        className="w-full text-left px-3.5 py-1.5 text-xs hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
                                    >
                                        List Your Hotel
                                    </button>
                                )}
                                <div className="border-t border-slate-100 my-1"></div>
                                <button 
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        logout();
                                    }} 
                                    className="w-full text-left px-3.5 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} className="bg-black text-white px-5 py-1.5 text-sm rounded-full cursor-pointer hover:bg-slate-900">
                        Login
                    </button>
                )}
                <img onClick={() => setIsMenuOpen(!isMenuOpen)} src={assets.menuIcon} alt="" className={`${isScrolled && "invert"} h-4 cursor-pointer`} />
            </div>

            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} z-50`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)} >
                    <img src={assets.closeMenu} alt="close-menu" className="h-6.5" />
                </button>

                {navLinks.map((navLink) => (
                    <NavLink key={navLink.name} to={navLink.path} onClick={() => setIsMenuOpen(false)}>
                        {navLink.name}
                    </NavLink>
                ))}

                {user && (
                    <>
                        <NavLink to="/my-bookings" onClick={() => setIsMenuOpen(false)}>
                            My Bookings
                        </NavLink>
                        <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all" onClick={() => { setIsMenuOpen(false); isOwner ? navigate('/owner') : setShowHotelReg(true); }}>
                            {isOwner ? 'Dashboard' : 'List Your Hotel'}
                        </button>
                        <button onClick={() => { setIsMenuOpen(false); logout(); }} className="bg-red-100 text-red-600 px-6 py-1.5 text-sm rounded-full cursor-pointer transition-all font-medium">
                            Logout
                        </button>
                    </>
                )}

                {!user && (
                    <button onClick={() => { setIsMenuOpen(false); navigate('/login'); }} className="bg-black text-white px-8 py-2.5 rounded-full cursor-pointer" >
                        Login
                    </button>
                )}
            </div>

        </nav>
    );
};

export default Navbar;
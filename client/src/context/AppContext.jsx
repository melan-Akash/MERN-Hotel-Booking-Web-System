import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();

    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [searchedCities, setSearchedCities] = useState([]); // max 3 recent searched cities

    const getToken = async () => {
        return token;
    };

    const logout = () => {
        setToken("");
        setUser(null);
        setIsOwner(false);
        setSearchedCities([]);
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        navigate("/");
    };

    const facilityIcons = {
        "Free WiFi": assets.freeWifiIcon,
        "Free Breakfast": assets.freeBreakfastIcon,
        "Room Service": assets.roomServiceIcon,
        "Mountain View": assets.mountainIcon,
        "Pool Access": assets.poolIcon,
    };

    const fetchUser = async (activeToken) => {
        const currentToken = activeToken || token;
        if (!currentToken) return;

        try {
            const { data } = await axios.get('/api/user', { 
                headers: { Authorization: `Bearer ${currentToken}` } 
            });
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role === "hotelOwner");
                setSearchedCities(data.user.recentSearchedCities);
            } else {
                toast.error(data.message);
                logout();
            }
        } catch (error) {
            toast.error(error.message);
            logout();
        }
    }

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/rooms')
            if (data.success) {
                setRooms(data.rooms)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            fetchUser(token);
        } else {
            localStorage.removeItem('token');
            setUser(null);
            setIsOwner(false);
        }
    }, [token]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const value = {
        currency, navigate,
        user, setUser,
        token, setToken,
        getToken, logout,
        isOwner, setIsOwner,
        axios,
        showHotelReg, setShowHotelReg,
        facilityIcons,
        rooms, setRooms,
        searchedCities, setSearchedCities
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );

};

export const useAppContext = () => useContext(AppContext);
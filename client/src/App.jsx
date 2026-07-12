import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Layout from './pages/hotelOwner/Layout'
import Dashboard from './pages/hotelOwner/Dashboard'
import AddRoom from './pages/hotelOwner/AddRoom'
import ListRoom from './pages/hotelOwner/ListRoom'
import HotelReg from './components/HotelReg'
import LoginPopup from './components/LoginPopup'
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast'
import AllRooms from './pages/AllRooms'
import RoomDetails from './pages/RoomDetails'
import Footer from './components/Footer'
import MyBookings from './pages/MyBookings'
import Loader from './components/Loader'
import PendingHotels from './pages/hotelOwner/PendingHotels'
import UpdateHotel from './pages/hotelOwner/UpdateHotel'
import PendingUpdates from './pages/hotelOwner/PendingUpdates'

const App = () => {

  // Check Is Route Starts With Owner
  const isOwnerPath = useLocation().pathname.includes("owner");

  const { showHotelReg, showLogin } = useAppContext();

  return (
    <div className='font-inter'>
      <Toaster />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      {showLogin && <LoginPopup />}
      <div className='min-h-[70vh]'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/rooms' element={<AllRooms />} />
        <Route path='/rooms/:id' element={<RoomDetails />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path="/loader/:nextUrl" element={<Loader />} />
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="list-room" element={<ListRoom />} />
          <Route path="pending-hotels" element={<PendingHotels />} />
          <Route path="update-hotel" element={<UpdateHotel />} />
          <Route path="pending-updates" element={<PendingUpdates />} />
        </Route>
      </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
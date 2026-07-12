import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// API to create a new room for a hotel
// POST /api/rooms
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    const hotel = await Hotel.findOne({ owner: req.user._id });

    if (!hotel) return res.json({ success: false, message: "No Hotel found" });

    // upload images to cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    // Wait for all uploads to complete
    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({ success: true, message: "Room created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all rooms
// GET /api/rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: 'hotel',
        populate: {
          path: 'owner', 
          select: 'image',
        },
      }).sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get all rooms for a specific hotel
// GET /api/rooms/owner
export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await Hotel.findOne({ owner: req.user._id });
    if (!hotelData) {
      return res.json({ success: true, rooms: [] });
    }
    const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate("hotel");
    res.json({ success: true, rooms });
  } catch (error) {
    console.log(error);
    
    res.json({ success: false, message: error.message });
  }
};

// API to toggle availability of a room
// POST /api/rooms/toggle-availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({ success: true, message: "Room availability Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @desc    Get room pricing data including overrides
// @route   GET /api/rooms/:roomId/pricing
// @access  Private/Owner
export const getRoomPricing = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId).populate("hotel");
    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    // Verify owner or admin
    if (room.hotel.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    res.json({ 
      success: true, 
      pricePerNight: room.pricePerNight, 
      priceOverrides: room.priceOverrides || [] 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @desc    Add, update, or remove a room pricing override
// @route   POST /api/rooms/:roomId/pricing
// @access  Private/Owner
export const updateRoomPricingOverride = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { date, price } = req.body; // date format: YYYY-MM-DD, price: Number

    const room = await Room.findById(roomId).populate("hotel");
    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }

    // Verify owner or admin
    if (room.hotel.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    // If price is null or equals default price per night, we clear the override
    if (price === null || price === undefined || Number(price) === room.pricePerNight) {
      room.priceOverrides = room.priceOverrides.filter(o => o.date !== date);
    } else {
      const overrideIndex = room.priceOverrides.findIndex(o => o.date === date);
      if (overrideIndex > -1) {
        room.priceOverrides[overrideIndex].price = Number(price);
      } else {
        room.priceOverrides.push({ date, price: Number(price) });
      }
    }

    await room.save();
    res.json({ 
      success: true, 
      message: "Room pricing overrides saved successfully", 
      priceOverrides: room.priceOverrides 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
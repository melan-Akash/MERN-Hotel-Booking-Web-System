import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// API to create a new hotel
// POST /api/hotels
export const registerHotel = async (req, res) => {
  try {
    const { 
      name, 
      address, 
      contact, 
      city, 
      description, 
      propertyType, 
      starRating, 
      checkInTime, 
      checkOutTime, 
      hotelAmenities 
    } = req.body;
    
    const owner = req.user._id;

    // Check if User Already Registered
    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) {
      return res.json({ success: false, message: "Hotel Already Registered" });
    }

    if (!req.file) {
      return res.json({ success: false, message: "Cover image is required" });
    }

    // Upload cover image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(req.file.path);
    const coverImage = uploadResponse.secure_url;

    // Parse hotelAmenities (since FormData stringifies arrays/objects)
    let amenitiesArray = [];
    if (hotelAmenities) {
      try {
        amenitiesArray = JSON.parse(hotelAmenities);
      } catch (error) {
        amenitiesArray = Array.isArray(hotelAmenities) ? hotelAmenities : [hotelAmenities];
      }
    }

    // Save to Database
    await Hotel.create({
      name,
      address,
      contact,
      city,
      owner,
      description,
      propertyType,
      coverImage,
      hotelAmenities: amenitiesArray,
      starRating: Number(starRating),
      policies: {
        checkInTime,
        checkOutTime
      },
      isApproved: false
    });

    res.json({ success: true, message: "Hotel registration submitted. Pending admin approval." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to fetch the current owner's hotel details
// GET /api/hotels/owner
export const getOwnerHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res.json({ success: false, message: "No hotel found for this owner." });
    }
    res.json({ success: true, hotel });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API for the owner to request hotel updates
// POST /api/hotels/update-request
export const requestHotelUpdate = async (req, res) => {
  try {
    const { 
      name, 
      address, 
      contact, 
      city, 
      description, 
      propertyType, 
      starRating, 
      checkInTime, 
      checkOutTime, 
      hotelAmenities 
    } = req.body;

    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    if (hotel.pendingUpdates) {
      return res.json({ success: false, message: "You already have a pending update under review." });
    }

    // Determine the cover image URL
    let coverImage = hotel.coverImage;
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path);
      coverImage = uploadResponse.secure_url;
    }

    // Parse hotelAmenities
    let amenitiesArray = [];
    if (hotelAmenities) {
      try {
        amenitiesArray = JSON.parse(hotelAmenities);
      } catch (error) {
        amenitiesArray = Array.isArray(hotelAmenities) ? hotelAmenities : [hotelAmenities];
      }
    }

    // Save changes into pendingUpdates
    hotel.pendingUpdates = {
      name,
      address,
      contact,
      city,
      description,
      propertyType,
      coverImage,
      hotelAmenities: amenitiesArray,
      starRating: Number(starRating),
      policies: {
        checkInTime,
        checkOutTime
      }
    };

    await hotel.save();

    res.json({ success: true, message: "Update request submitted. Pending admin approval." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
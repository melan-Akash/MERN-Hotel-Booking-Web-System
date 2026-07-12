import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// @desc    Get all pending hotels for approval
// @route   GET /api/admin/pending-hotels
// @access  Private/Admin
export const getPendingHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isApproved: false }).populate(
      "owner",
      "username email image"
    );
    res.json({ success: true, hotels });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @desc    Approve a pending hotel registration
// @route   POST /api/admin/approve-hotel
// @access  Private/Admin
export const approveHotel = async (req, res) => {
  try {
    const { hotelId } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    if (hotel.isApproved) {
      return res.json({ success: false, message: "Hotel is already approved" });
    }

    // Set approved status
    hotel.isApproved = true;
    await hotel.save();

    // Update owner's role to hotelOwner
    await User.findByIdAndUpdate(hotel.owner, { role: "hotelOwner" });

    res.json({
      success: true,
      message: "Hotel approved successfully. Owner role updated to hotelOwner.",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @desc    Get all hotels with pending updates
// @route   GET /api/admin/pending-updates
// @access  Private/Admin
export const getPendingUpdates = async (req, res) => {
  try {
    const hotels = await Hotel.find({ pendingUpdates: { $ne: null } }).populate(
      "owner",
      "username email image"
    );
    res.json({ success: true, hotels });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @desc    Approve hotel updates
// @route   POST /api/admin/approve-update
// @access  Private/Admin
export const approveHotelUpdate = async (req, res) => {
  try {
    const { hotelId } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    if (!hotel.pendingUpdates) {
      return res.json({ success: false, message: "No pending updates found for this hotel." });
    }

    const updates = hotel.pendingUpdates;

    // Apply pending updates to live fields
    hotel.name = updates.name;
    hotel.address = updates.address;
    hotel.contact = updates.contact;
    hotel.city = updates.city;
    hotel.description = updates.description;
    hotel.propertyType = updates.propertyType;
    hotel.coverImage = updates.coverImage;
    hotel.hotelAmenities = updates.hotelAmenities;
    hotel.starRating = updates.starRating;
    hotel.policies = updates.policies;

    // Clear pending updates
    hotel.pendingUpdates = null;

    await hotel.save();

    res.json({ success: true, message: "Hotel updates approved and applied successfully." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @desc    Reject hotel updates
// @route   POST /api/admin/reject-update
// @access  Private/Admin
export const rejectHotelUpdate = async (req, res) => {
  try {
    const { hotelId } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    if (!hotel.pendingUpdates) {
      return res.json({ success: false, message: "No pending updates found for this hotel." });
    }

    // Clear pending updates
    hotel.pendingUpdates = null;

    await hotel.save();

    res.json({ success: true, message: "Hotel updates rejected and discarded." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

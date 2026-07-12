import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

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

// @desc    Get global platform analytics (revenue, users, hotels)
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getGlobalAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHotels = await Hotel.countDocuments({ isApproved: true });
    
    // Sum total pricing of all completed bookings
    const bookings = await Booking.find({ isPaid: true });
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalHotels,
        totalRevenue
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @desc    Get list of all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @desc    Update user dashboard role
// @route   POST /api/admin/users/update-role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!["user", "hotelOwner", "admin"].includes(role)) {
      return res.json({ success: false, message: "Invalid role specified." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, message: `User role updated to ${role} successfully.` });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @desc    Suspend or unsuspend a user account
// @route   POST /api/admin/users/toggle-suspension
// @access  Private/Admin
export const toggleUserSuspension = async (req, res) => {
  try {
    const { userId, isSuspended, suspensionReason } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    user.isSuspended = isSuspended;
    user.suspensionReason = isSuspended ? (suspensionReason || "Violated terms of service.") : "";
    await user.save();

    res.json({ 
      success: true, 
      message: isSuspended ? "User account suspended successfully." : "User account unsuspended." 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @desc    Get all platform reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "username email")
      .populate("hotel", "name city")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, reviews });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @desc    Delete/Moderate a specific review
// @route   DELETE /api/admin/reviews/:reviewId
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.json({ success: false, message: "Review not found." });
    }

    res.json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

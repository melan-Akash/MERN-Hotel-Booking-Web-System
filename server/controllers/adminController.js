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

import Review from "../models/Review.js";
import Hotel from "../models/Hotel.js";

// @desc    Add a review for a hotel
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { hotelId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!hotelId || !rating || !comment) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    const review = await Review.create({
      user: userId,
      hotel: hotelId,
      rating: Number(rating),
      comment
    });

    res.json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews for a specific hotel
// @route   GET /api/reviews/:hotelId
// @access  Public
export const getHotelReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const reviews = await Review.find({ hotel: hotelId })
      .populate("user", "username image")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

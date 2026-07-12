import Message from "../models/Message.js";

// @desc    Get chat history between current user and another participant
// @route   GET /api/messages/:receiverId
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { hotelId } = req.query;
    const senderId = req.user._id;

    if (!hotelId) {
      return res.json({ success: false, message: "hotelId query parameter is required." });
    }

    const messages = await Message.find({
      hotel: hotelId,
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

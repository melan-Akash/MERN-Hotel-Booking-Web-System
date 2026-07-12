import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addReview, getHotelReviews } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", protect, addReview);
reviewRouter.get("/:hotelId", getHotelReviews);

export default reviewRouter;

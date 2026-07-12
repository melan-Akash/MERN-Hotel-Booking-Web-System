import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { 
  getPendingHotels, 
  approveHotel, 
  getPendingUpdates, 
  approveHotelUpdate, 
  rejectHotelUpdate,
  getGlobalAnalytics,
  getAllUsers,
  updateUserRole,
  toggleUserSuspension,
  getAllReviews,
  deleteReview
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/pending-hotels", protect, isAdmin, getPendingHotels);
adminRouter.post("/approve-hotel", protect, isAdmin, approveHotel);
adminRouter.get("/pending-updates", protect, isAdmin, getPendingUpdates);
adminRouter.post("/approve-update", protect, isAdmin, approveHotelUpdate);
adminRouter.post("/reject-update", protect, isAdmin, rejectHotelUpdate);

// Module 3: Admin pages routes
adminRouter.get("/analytics", protect, isAdmin, getGlobalAnalytics);
adminRouter.get("/users", protect, isAdmin, getAllUsers);
adminRouter.post("/users/update-role", protect, isAdmin, updateUserRole);
adminRouter.post("/users/toggle-suspension", protect, isAdmin, toggleUserSuspension);
adminRouter.get("/reviews", protect, isAdmin, getAllReviews);
adminRouter.delete("/reviews/:reviewId", protect, isAdmin, deleteReview);

export default adminRouter;

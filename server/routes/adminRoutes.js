import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { 
  getPendingHotels, 
  approveHotel, 
  getPendingUpdates, 
  approveHotelUpdate, 
  rejectHotelUpdate 
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/pending-hotels", protect, isAdmin, getPendingHotels);
adminRouter.post("/approve-hotel", protect, isAdmin, approveHotel);
adminRouter.get("/pending-updates", protect, isAdmin, getPendingUpdates);
adminRouter.post("/approve-update", protect, isAdmin, approveHotelUpdate);
adminRouter.post("/reject-update", protect, isAdmin, rejectHotelUpdate);

export default adminRouter;

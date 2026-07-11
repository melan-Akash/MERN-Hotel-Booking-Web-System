import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { getPendingHotels, approveHotel } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/pending-hotels", protect, isAdmin, getPendingHotels);
adminRouter.post("/approve-hotel", protect, isAdmin, approveHotel);

export default adminRouter;

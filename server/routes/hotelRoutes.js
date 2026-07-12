import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel, getOwnerHotel, requestHotelUpdate, getHotelGuests } from "../controllers/hotelController.js";
import upload from "../middleware/uploadMiddleware.js";

const hotelRouter = express.Router();

hotelRouter.post("/", protect, upload.single("coverImage"), registerHotel);
hotelRouter.get("/owner", protect, getOwnerHotel);
hotelRouter.post("/update-request", protect, upload.single("coverImage"), requestHotelUpdate);
hotelRouter.get("/owner/guests", protect, getHotelGuests);

export default hotelRouter;

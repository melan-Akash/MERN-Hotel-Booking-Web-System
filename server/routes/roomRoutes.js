import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { 
  createRoom, 
  getRooms, 
  toggleRoomAvailability, 
  getOwnerRooms,
  getRoomPricing,
  updateRoomPricingOverride
} from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 5), protect, createRoom);
roomRouter.get("/", getRooms);
roomRouter.get("/owner", protect, getOwnerRooms);
roomRouter.post("/toggle-availability", protect, toggleRoomAvailability);
roomRouter.get("/:roomId/pricing", protect, getRoomPricing);
roomRouter.post("/:roomId/pricing", protect, updateRoomPricingOverride);

export default roomRouter;

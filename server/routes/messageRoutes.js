import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getChatHistory } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/:receiverId", protect, getChatHistory);

export default messageRouter;

import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import Message from "./models/Message.js";
import connectCloudinary from "./configs/cloudinary.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

connectDB();
connectCloudinary();

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io Server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io Connection Logic
io.on("connection", (socket) => {
  // Join user-specific private room
  socket.on("join_chat", ({ userId }) => {
    socket.join(userId);
  });

  // Handle live messages
  socket.on("send_message", async ({ senderId, receiverId, hotelId, text }) => {
    try {
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        hotel: hotelId,
        text
      });

      // Emit to receiver's and sender's rooms
      io.to(receiverId).emit("receive_message", newMessage);
      io.to(senderId).emit("receive_message", newMessage);
    } catch (error) {
      console.error("Socket send_message error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    // Socket disconnected
  });
});

// API to listen to Stripe Webhooks
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Middleware to parse JSON
app.use(express.json());

app.get("/", (req, res) => res.send("API is working"));
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/messages", messageRouter);
app.use("/api/reviews", reviewRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

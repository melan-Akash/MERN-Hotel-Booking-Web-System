import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    role: { type: String, enum: ["user", "hotelOwner", "admin"], default: "user" },
    recentSearchedCities: [{ type: String, default: [] }],
    
    // Account Management (Suspension workflow)
    isSuspended: { type: Boolean, default: false },
    suspensionReason: { type: String, default: "" }
  }, { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
import mongoose from "mongoose";
const { Schema } = mongoose;

const roomSchema = new Schema(
  {
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    roomType: { type: String, required: true }, // "Single Bed", "Double Bed"
    pricePerNight: { type: Number, required: true },
    amenities: { type: Array, required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    
    // Dynamic Pricing Calendar Overrides (date is string "YYYY-MM-DD")
    priceOverrides: [
      {
        date: { type: String, required: true },
        price: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;

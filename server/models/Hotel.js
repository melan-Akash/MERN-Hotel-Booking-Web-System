import mongoose from "mongoose";
const { Schema } = mongoose;

const hotelSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    city: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
    
    // Professional Fields
    description: { type: String, required: true },
    propertyType: { 
      type: String, 
      required: true, 
      enum: ['Hotel', 'Villa', 'Resort', 'Guest House'] 
    },
    coverImage: { type: String, required: true },
    hotelAmenities: [{ type: String }],
    starRating: { type: Number, required: true, min: 1, max: 5 },
    policies: {
      checkInTime: { type: String, required: true },
      checkOutTime: { type: String, required: true }
    },

    // Map location coordinates
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },

    // Pending updates for Admin Approval workflow
    pendingUpdates: { type: Object, default: null }
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;

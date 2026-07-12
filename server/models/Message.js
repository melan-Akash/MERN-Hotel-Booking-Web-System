import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    text: { type: String, required: true },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

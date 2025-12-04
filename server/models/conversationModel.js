import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number, 
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Conversation = mongoose.model("Conversation", conversationSchema);

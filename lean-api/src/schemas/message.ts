import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
  _id: Schema.Types.ObjectId,
  content: {
    type: String,
    trim: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["message", "info"],
    default: "message",
    trim: true,
    required: true,
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Message = model("Message", MessageSchema);

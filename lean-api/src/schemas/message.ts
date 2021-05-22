import { Schema, model, Document } from "mongoose";
import { User } from "./user";
import { Room } from "./room";

export interface Message extends Document {
  _id: string;
  content: string;
  user: User;
  room: Room;
  type: string;
  timestamp: string;
}

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
    enum: ["message", "info", "alert", "warning"],
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

export const Message = model<Message>("Message", MessageSchema);

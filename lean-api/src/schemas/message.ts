import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
  content: {
    type: String,
    trim: true,
    required: true
  },
  userId: {
    type: String,
    trim: true,
    required: true
  },
  type: {
    type: String,
    enum: ['message', 'info'],
    default: 'message',
    trim: true,
    required: true
  },
  roomId: {
    type: String,
    trim: true,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const Message = model('Message', MessageSchema);
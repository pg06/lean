import { Schema, model, models, Document } from "mongoose";
import { User } from "./user";
import { Message } from "./message";

export interface Room extends Document {
  _id: string;
  name: string;
  slug: string;
  timestamp: string;
  messages: Message[];
  users: User[];
  isDefault: boolean;
}
const RoomSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    trim: true,
    required: [true, "Invalid Chat Name!"],
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isDefault: {
    type: Boolean,
    default: false,
  },
});

RoomSchema.path("slug").validate(async (slug: string) => {
  const count = await models.Room.countDocuments({ slug });
  return !count;
}, "Chat already exists");

export const Room = model<Room>("Room", RoomSchema);

import { Schema, model, models, Document } from "mongoose";
import { User } from "./user";
import { Message } from "./message";
import _ from "lodash";

export interface Room extends Document {
  _id: string;
  name: string;
  slug: string;
  timestamp: string;
  messages: Message[];
  users: User[];
  isDefault: boolean;
}
const RoomSchema = new Schema<Room>({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    trim: true,
    required: [true, "Invalid Chat Name!"],
  },
  slug: {
    type: String,
    trim: true,
    unique: [true, "Chat already exists"],
    required: [true, "Invalid Chat Slug!"],
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

RoomSchema.pre("save", function (next) {
  this.users = _.uniq(this.users.filter((u) => u));
  next();
});

export const Room = model<Room>("Room", RoomSchema);

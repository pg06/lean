import { Schema, model, models } from "mongoose";

const RoomSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    trim: true,
    required: true,
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
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
  isDefault: {
    type: Boolean,
    default: false,
  },
});

RoomSchema.path("slug").validate(async (slug: string) => {
  const count = await models.Room.countDocuments({ slug });
  return !count;
}, "Room already exists");

export const Room = model("Room", RoomSchema);

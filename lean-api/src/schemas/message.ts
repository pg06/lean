import { Schema, model, models, Document } from "mongoose";
import { User } from "./user";
import { Room } from "./room";

interface UserAndRoom {
  user: User;
  room: Room;
}

export interface Message extends Document {
  _id: string;
  content: string;
  user: User;
  room: Room;
  type: string;
  timestamp: string;
  userAndRoom: UserAndRoom;
}

const MessageSchema = new Schema({
  _id: Schema.Types.ObjectId,
  content: {
    type: String,
    trim: true,
    required: true,
  },
  type: {
    type: String,
    enum: ["message", "info", "alert", "warning"],
    default: "message",
    trim: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "You should sign in"],
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "You should enter a chat"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// MessageSchema.path("user").validate(async (userId: string) => {
//   const user = await models.User.findById(userId);
//   return user && user.email && user.birthday;
// }, "You should complete sign in");

MessageSchema.post("validate", async ({ room, user, type }) => {
  if (type === "message") {
    const userExists = await models.User.findById(user);
    if (!userExists || !userExists.email || !userExists.birthday) {
      throw Error("You should complete sign in");
    }
  }
  // const roomExists = await models.Room.findOne({
  //   _id: room,
  //   "users._id": user,
  // });
  // if (!roomExists) throw Error("You should enter a chat!");
});

export const Message = model<Message>("Message", MessageSchema);

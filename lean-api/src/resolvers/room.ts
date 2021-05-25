import slugify from "slugify";
import { User, Room, Message } from "../schemas";
import { Types } from "mongoose";

export default {
  Query: {
    getAllRooms: (_: any, { isDefault }: { isDefault: boolean }) =>
      [true, false].indexOf(isDefault) > -1
        ? Room.find({ isDefault })
        : Room.find(),
    getRoomsByUser: (
      _: any,
      { userId }: { userId: string },
      { userId: userIdCtx }: any
    ) =>
      userId
        ? Room.find({ users: userIdCtx || userId }).populate({
            path: "messages",
            populate: { path: "user" },
          })
        : [],
    enterRoom: async (
      _: any,
      {
        userId,
        name,
        slug,
      }: {
        userId: any;
        name: string;
        slug: string;
      },
      ctx: any
    ) => {
      userId = ctx.userId || userId;
      if (!userId) throw new Error("You should login to enter a Chat!");
      if (slug) {
        slug = slug.trim();
        name = slug[0].toUpperCase() + slug.slice(1).split("-").join(" ");
      }
      name = name.trim();
      let room = await Room.findOne({
        name: {
          $regex: new RegExp(`^${name.toLowerCase()}$`, "i"),
        },
      });
      if (!room) {
        room = new Room({
          _id: new Types.ObjectId(),
          name,
          slug: slugify(name),
        });
      }
      if (!room.users.includes(userId)) {
        const message = await Message.create({
          _id: new Types.ObjectId(),
          type: "info",
          content: "$enter_room$",
          user: userId,
          room: room.id,
        });
        room.messages.push(message.id);
        room.users.push(userId);
      }
      await room.save();
      return await Room.findById(room.id).populate({
        path: "messages",
        populate: { path: "user" },
      });
    },
  },

  Mutation: {
    createRoom: async (
      _: any,
      { name, isDefault }: { name: string; isDefault: boolean },
      { userId, user }: any
    ) => {
      const _id = new Types.ObjectId();
      const room = Room.create({
        _id,
        name,
        isDefault,
        slug: slugify(name),
      });
      if (user && user.email && user.birthday) {
        return Room.findByIdAndUpdate(
          _id,
          {
            $push: { users: userId },
          },
          { new: true }
        );
      }
      return room;
    },
    updateRoom: (
      _: any,
      {
        roomId,
        name,
        isDefault,
      }: { roomId: string; name: string; isDefault: boolean }
    ) =>
      Room.findByIdAndUpdate(
        roomId,
        {
          name,
          isDefault,
          slug: slugify(name),
        },
        { new: true }
      ),
    leaveRoom: async (
      _: any,
      { roomId }: { roomId: string },
      { userId }: any
    ) => {
      const room = await Room.findById(roomId);
      if (room && room.users.includes(userId)) {
        await Message.create({
          _id: new Types.ObjectId(),
          type: "info",
          content: "$leave_room$",
          user: userId,
          room: roomId,
        });
        await Room.findByIdAndUpdate(roomId, { $pull: { users: userId } });
      }
      return await Room.findById(roomId);
    },
  },
};

import slugify from "slugify";
import { User, Room, Message } from "../schemas";
import { Types } from "mongoose";

export default {
  Query: {
    getAllRooms: (_: any, { isDefault }: { isDefault: boolean }) =>
      [true, false].indexOf(isDefault) > -1
        ? Room.find({ isDefault })
        : Room.find(),
    getRoom: async (_: any, { slug, name }: { slug: string; name: string }) => {
      if (name || slug) {
        name = (name || "").trim().toLowerCase();
        slug = (slug || "").trim().toLowerCase();
        const room = Room.findOne({
          $or: [
            { name: { $regex: new RegExp(name, "i") } },
            { slug: { $regex: new RegExp(slug, "i") } },
          ],
        }).populate({
          path: "messages",
          populate: {
            path: "user",
          },
        });
        if (room) return room;
        if (name) {
          return (
            await Room.create({
              _id: new Types.ObjectId(),
              name,
              isDefault: false,
              slug: slugify(name),
            })
          ).populate({
            path: "messages",
            populate: {
              path: "user",
            },
          });
        }
      }
    },
  },

  Mutation: {
    createRoom: async (
      _: any,
      {
        name,
        isDefault,
        userId,
      }: { name: string; isDefault: boolean; userId: string }
    ) => {
      const _id = new Types.ObjectId();
      const room = Room.create({
        _id,
        name,
        isDefault,
        slug: slugify(name),
      });
      const user = await User.findOne({
        $and: [
          { _id: userId },
          { email: { $ne: undefined } },
          { birthday: { $ne: undefined } },
        ],
      });
      if (user) {
        return Room.findByIdAndUpdate(
          _id,
          {
            $push: { users: { _id: userId } },
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
    enterRoom: async (
      _: any,
      {
        roomId,
        name,
        slug,
        userId,
        isDefault,
      }: {
        roomId: string;
        name: string;
        slug: string;
        userId: string;
        isDefault: boolean;
      }
    ) => {
      let user = await User.findOne({
        $and: [{ _id: userId }],
      });
      if (!user) throw new Error("You should login to enter a Chat!");
      const _id = new Types.ObjectId();
      const enterRoomUpdate = { $push: { users: { _id: userId } } };
      const whereByStr = (key: string, val: string) => ({
        [key]: { $regex: new RegExp((val || "").trim().toLowerCase(), "i") },
      });
      let room;
      if (roomId) {
        room = await Room.findByIdAndUpdate(roomId, enterRoomUpdate, {
          new: true,
        });
      }
      if (name) {
        room = await Room.findOneAndUpdate(
          whereByStr("name", name),
          enterRoomUpdate,
          { new: true }
        );
      }
      if (slug) {
        room = await Room.findOneAndUpdate(
          whereByStr("slug", slug),
          enterRoomUpdate,
          { new: true }
        );
      }
      if (!room) {
        name = name || "";
        room = await Room.create({
          _id,
          name,
          isDefault,
          slug: slugify(name),
        });
      }
      if (room && user && user.email && user.birthday) {
        if (!roomId) roomId = room.id;
        await Message.create({
          _id: new Types.ObjectId(),
          type: "info",
          content: "$enter_room$",
          user: { _id: userId },
          room: { _id: roomId },
        });
      }
      return room.populate("users").populate("messages");
    },
    leaveRoom: (
      _: any,
      { roomId, userId }: { roomId: string; userId: string }
    ) => {
      Room.findByIdAndUpdate(
        roomId,
        { $pull: { users: { _id: userId } } },
        { new: true }
      );
      Message.create({
        type: "info",
        content: "$leave_room$",
        user: { _id: userId },
        room: { _id: roomId },
      });
    },
  },

  Subscription: {
    getRoom: async (roomId: string, slug: string, name: string) =>
      await Room.find({ $or: [{ _id: roomId }, { slug }, { name }] }).populate({
        path: "messages",
        populate: { path: "users" },
      }),
  },
};

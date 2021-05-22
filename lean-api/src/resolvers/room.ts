import slugify from "slugify";
import { Room, Message } from "../schemas";
import { Types } from "mongoose";

export default {
  Query: {
    rooms: async (_: any, { isDefault }: { isDefault: boolean }) => {
      if ([true, false].indexOf(isDefault) > -1) {
        return await Room.find({ isDefault });
      }
      return await Room.find();
    },
    room: async (_: any, { slug, name }: { slug: string; name: string }) => {
      if (slug) {
        slug = slug.trim().toLowerCase();
        const room1 = await Room.findOne({ slug }).populate({
          path: "messages",
          populate: {
            path: "user",
          },
        });
        return room1;
      }
      if (name) {
        const room = await Room.findOne({
          name: { $regex: new RegExp(name.trim().toLowerCase(), "i") },
        }).populate({
          path: "messages",
          populate: {
            path: "user",
          },
        });
        if (!room) {
          return await Room.create({
            _id: new Types.ObjectId(),
            name,
            isDefault: false,
            slug: slugify(name),
          });
        }
        return room;
      }
    },
  },

  Mutation: {
    createRoom: async (
      _: any,
      { name, isDefault }: { name: string; isDefault: boolean }
    ) =>
      await Room.create({
        _id: new Types.ObjectId(),
        name,
        isDefault,
        slug: slugify(name),
      }),
    updateRoom: async (
      _: any,
      {
        roomId,
        name,
        isDefault,
      }: { roomId: string; name: string; isDefault: boolean }
    ) =>
      await Room.findByIdAndUpdate(
        roomId,
        {
          name,
          isDefault,
          slug: slugify(name),
        },
        { new: true }
      ),
  },
};

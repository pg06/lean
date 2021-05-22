import { Types } from "mongoose";
import { Message, Room } from "../schemas";

export default {
  Query: {
    getAllMessages: () => Message.find().populate('room').populate('user'),
    getMessagesByRoom: (
      _: any,
      { roomId, type }: { roomId: string; type: string }
    ) =>
      Message.find({
        $and: [{ "room._id": roomId }],
        $or: [{ type }],
      }).populate('room').populate('user'),
    getMessagesByContent: (
      _: any,
      { roomId, search, type }: { roomId: string; search: string; type: string }
    ) =>
      Message.find({
        $and: [{ content: { $regex: new RegExp(search, "i") } }],
        $or: [{ type }],
      }).populate('room').populate('user'),
  },

  Mutation: {
    createMessage: async (
      _: any,
      {
        content,
        userId,
        roomId,
      }: { content: string; userId: string; roomId: string }
    ) => {
      const _id = new Types.ObjectId();
      const room = await Room.find({
        $and: [{ _id: roomId }, { "users._id": userId }],
      });
      if (!room) return;
      const message = await Message.create({
        _id,
        content,
        user: userId,
        room: roomId,
      });
      await Room.findByIdAndUpdate(
        roomId,
        { $push: { messages: { _id } } },
        { new: true }
      );
      return message.populate('room').populate('user');
    },
  },
};

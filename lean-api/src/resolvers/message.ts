import { Types } from "mongoose";
import { Message, Room } from "../schemas";

export default {
  Query: {
    messages: async () => await Message.find(),
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
      return message;
    },
  },
};

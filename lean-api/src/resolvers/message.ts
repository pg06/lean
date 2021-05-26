import { Types } from "mongoose";
import { Message, Room } from "../schemas";
const { DB_NAME } = process.env;

export default {
  Query: {
    getAllMessages: () => Message.find().populate("room").populate("user"),
    getMessagesByRoom: (_: any, { roomId }: { roomId: Room }) =>
      Message.find({ room: roomId }).populate("room").populate("user"),
  },

  Mutation: {
    sendMessage: async (
      _: any,
      {
        content,
        roomId,
        userId,
      }: { content: string; roomId: string; userId: string },
      ctx: any
    ) => {
      userId = ctx.userId || userId;
      let message = null;
      message = await Message.create({
        _id: new Types.ObjectId(),
        content,
        user: userId,
        room: roomId,
      });
      const room = await Room.findByIdAndUpdate(
        roomId,
        { $push: { messages: message._id } },
        { new: true }
      );
      message = await Message.findById(message._id)
        .populate("room")
        .populate("user");
      if (!room) return null;
      ctx.pubsub.publish(`${DB_NAME}_${room.slug}`, { message });
      return message;
    },
  },

  Subscription: {
    message: {
      subscribe: (_: any, { slug }: { slug: string }, { pubsub }: any) =>
        pubsub.asyncIterator(`${DB_NAME}_${slug}`),
    },
  },
};

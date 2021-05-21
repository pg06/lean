import { Message } from "../schemas";

export default {
  Query: {
    messages: async () => await Message.find(),
    roomMessages: async (_: any, { roomId }: { roomId: string }) =>
      await Message.find({ roomId }),
  },

  Mutation: {
    createMessage: async (
      _: any,
      {
        content,
        userId,
        roomId,
      }: { content: string; userId: string; roomId: string }
    ) => await Message.create({ content, userId, roomId }),
  },
};

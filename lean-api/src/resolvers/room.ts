import slugify from "slugify";
import { Room, Message } from "../schemas";

export default {
  Query: {
    rooms: async () => await Room.find(),
    room: async (_: any, { roomId, slug }: { roomId: string; slug: string }) =>
      roomId ? await Room.findById(roomId) : await Room.findOne({ slug }),
    roomWithMessages: async (
      _: any,
      { roomId, slug }: { roomId: string; slug: string }
    ) => {
      const room = roomId
        ? await Room.findById(roomId)
        : await Room.findOne({ slug });
      if (!room) return room;
      if (!roomId) roomId = room.id;
      room["messages"] = await Message.find({ roomId });
      return room;
    },
  },

  Mutation: {
    createRoom: async (_: any, { name }: { name: string }) => {
      const room = new Room({ name, slug: slugify(name) });
      room.id = room._id;
      await room.save();
      return room;
    },
  },
};

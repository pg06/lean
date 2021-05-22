import { Types } from "mongoose";
import { User } from "../schemas";

export default {
  Query: {
    users: async () => await User.find(),
    user: async ({ email }: { email: string }) => await User.findOne({ email }),
  },

  Mutation: {
    createUser: async (
      _: any,
      {
        name,
        email,
        birthday,
      }: { name: string; email: string; birthday: string }
    ) =>
      await User.create({ _id: new Types.ObjectId(), name, email, birthday }),
    updateUser: async (
      _: any,
      {
        userId,
        name,
        email,
        birthday,
      }: { userId: string; name: string; email: string; birthday: string }
    ) => {
      return await User.findByIdAndUpdate(
        userId,
        { name, email, birthday },
        { new: true }
      );
    },
    createUnloggedUser: async (_: any, { name }: { name: string }) => {
      const _id = new Types.ObjectId();
      const user = new User({
        _id,
        name,
      });
      await user.save({ validateBeforeSave: false });
      return user;
    },
  },
};

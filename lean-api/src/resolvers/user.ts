import { Types } from "mongoose";
import { User } from "../schemas";

export default {
  Query: {
    getSelf: (_: any, __: any, { user }: { user: User }) => user,
  },

  Mutation: {
    createUnloggedUser: (_: any, { name }: { name: string }) => {
      const _id = new Types.ObjectId();
      const user = new User({
        _id,
        name,
      });
      return user.save({ validateBeforeSave: false });
    },

    createUser: (
      _: any,
      {
        name,
        email,
        birthday,
      }: { name: string; email: string; birthday: string }
    ) => User.create({ _id: new Types.ObjectId(), name, email, birthday }),

    completeSignIn: (
      _: any,
      {
        name,
        email,
        birthday,
        userId,
      }: { name: string; email: string; birthday: string; userId: string },
      ctx: any
    ) =>
      User.findByIdAndUpdate(
        ctx.userId || userId,
        { name, email, birthday },
        { new: true }
      ),

    updateUser: (
      _: any,
      {
        userId,
        name,
        email,
        birthday,
      }: { userId: string; name: string; email: string; birthday: string }
    ) =>
      User.findByIdAndUpdate(userId, { name, email, birthday }, { new: true }),
  },
};

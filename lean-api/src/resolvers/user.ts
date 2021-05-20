import { User } from "../schemas";

export default {
  Query: {
    users: async () => await User.find(),
    user: async ({ email }: { email: string }) => await User.findOne({ email }),
  },

  Mutation: {
    createUser: async (_:any,
      { name, email, birthday }:
      { name: string, email: string, birthday: string }
    ) => {
      const user = new User({ name, email, birthday });
      user.id = user._id;
      await user.save();
      return user;
    },
    updateUser: async (_:any,
      { userId, name, email, birthday }:
      { userId: string, name: string, email: string, birthday: string }
    ) => {
      return await User.findByIdAndUpdate(userId, { name, email, birthday }, {new: true});
    },
    createUnloggedUser: async (_:any,
      { name }: { name: string }
    ) => {
      const user = new User({ name, email: undefined });
      user.id = user._id;
      await user.save({ validateBeforeSave: false });
      return user;
    },
  }
};
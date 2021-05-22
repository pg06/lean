import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: null,
    validate: {
      validator: function (email: string) {
        var re = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return re.test(email);
      },
      message: "Please enter a valid email",
    },
  },
  birthday: {
    type: Date,
    default: null,
  },
});

UserSchema.path("email").validate(async (email: string) => {
  if (email === null) return true;
  const count = await models.User.countDocuments({ email });
  return !count;
}, "Email already exists");

export const User = model("User", UserSchema);

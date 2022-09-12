import { model, Schema } from "mongoose";

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  drawings: [{ type: Schema.Types.ObjectId, ref: "Drawing" }],
});

const User = model("User", userSchema, "users");

export default User;

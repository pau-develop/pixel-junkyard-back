import { model, Schema } from "mongoose";

export interface UserData {
  userName: string;
  password: string;
  email: string;
}

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
});

const User = model("User", userSchema, "users");

export default User;

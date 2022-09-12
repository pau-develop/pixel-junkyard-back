import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
} from "../controllers/usersControllers";
import tokenVerification from "../middlewares/tokenVerification";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/modify", tokenVerification, updateUser);

export default userRouter;

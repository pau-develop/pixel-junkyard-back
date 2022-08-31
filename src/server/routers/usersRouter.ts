import express from "express";
import { registerUser, loginUser } from "../controllers/usersControllers";

const usersRouter = express.Router();

usersRouter.post("/register", registerUser);
usersRouter.post("/login", loginUser);

export default usersRouter;
